interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
  boundingbox?: string[];
}

interface CacheEntry {
  expiresAt: number;
  results: GeocodeResult[];
}

type GeocodeErrorCode = "bad_request" | "method_not_allowed" | "rate_limited" | "upstream" | "unknown";

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "LensLab/1.0 (contact@example.com)";
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX_ITEMS = 100;

const cache = new Map<string, CacheEntry>();

const sendJson = (res: any, status: number, payload: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const sendError = (res: any, status: number, code: GeocodeErrorCode, message: string) => {
  sendJson(res, status, {
    error: {
      code,
      message,
      status,
    },
  });
};

const readQuery = (req: any): string => {
  const url = new URL(req.url || "", "http://localhost");
  const rawQuery = url.searchParams.get("q") || "";
  return rawQuery.trim();
};

const getCachedResults = (key: string): GeocodeResult[] | undefined => {
  const entry = cache.get(key);
  if (!entry) return undefined;

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }

  cache.delete(key);
  cache.set(key, entry);
  return entry.results;
};

const setCachedResults = (key: string, results: GeocodeResult[]) => {
  while (cache.size >= CACHE_MAX_ITEMS) {
    const oldestKey = cache.keys().next().value;
    if (!oldestKey) break;
    cache.delete(oldestKey);
  }

  cache.set(key, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    results,
  });
};

const normalizeResult = (item: any): GeocodeResult | null => {
  const lat = Number.parseFloat(item?.lat);
  const lng = Number.parseFloat(item?.lon);
  const displayName = typeof item?.display_name === "string" ? item.display_name : "";

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !displayName) {
    return null;
  }

  return {
    displayName,
    lat,
    lng,
    boundingbox: Array.isArray(item?.boundingbox) ? item.boundingbox.map(String) : undefined,
  };
};

const searchNominatim = async (query: string): Promise<GeocodeResult[]> => {
  const url = new URL(NOMINATIM_ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "8");

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Language": "ja,en;q=0.8",
    },
  });

  if (!response.ok) {
    const code = response.status === 429 ? "rate_limited" : "upstream";
    throw {
      status: response.status,
      code,
      message:
        response.status === 429
          ? "Nominatim geocoding is rate limited. Please try again later."
          : "Nominatim geocoding failed.",
    };
  }

  const payload = await response.json().catch(() => null);
  if (!Array.isArray(payload)) {
    throw {
      status: 502,
      code: "upstream",
      message: "Nominatim returned an invalid response.",
    };
  }

  return payload.map(normalizeResult).filter((item): item is GeocodeResult => Boolean(item));
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    sendError(res, 405, "method_not_allowed", "Only GET is supported.");
    return;
  }

  try {
    const query = readQuery(req);
    if (!query) {
      sendError(res, 400, "bad_request", "q query parameter is required.");
      return;
    }

    const cacheKey = query.toLowerCase();
    const cachedResults = getCachedResults(cacheKey);
    if (cachedResults) {
      sendJson(res, 200, {
        results: cachedResults,
        cached: true,
      });
      return;
    }

    const results = await searchNominatim(query);
    setCachedResults(cacheKey, results);

    sendJson(res, 200, {
      results,
      cached: false,
    });
  } catch (error: any) {
    sendError(
      res,
      typeof error?.status === "number" ? error.status : 500,
      error?.code || "unknown",
      error?.message || "Geocoding failed."
    );
  }
}
