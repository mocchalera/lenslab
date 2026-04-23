import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { CustomLocation } from '../types';

type LeafletComponentProps = React.PropsWithChildren<Record<string, unknown>>;

const LeafletMapContainer = MapContainer as unknown as React.ComponentType<LeafletComponentProps>;
const LeafletTileLayer = TileLayer as unknown as React.ComponentType<LeafletComponentProps>;
const LeafletMarker = Marker as unknown as React.ComponentType<LeafletComponentProps>;

const MARKER_ICON = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png';
const MARKER_ICON_2X = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png';
const MARKER_SHADOW = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: MARKER_ICON_2X,
  iconUrl: MARKER_ICON,
  shadowUrl: MARKER_SHADOW,
});

interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
  boundingbox?: string[];
}

interface LocationPickerModalProps {
  initialLocation?: CustomLocation;
  onClose: () => void;
  onClear: () => void;
  onConfirm: (location: CustomLocation) => void;
}

interface MapClickHandlerProps {
  onPick: (location: CustomLocation) => void;
}

const DEFAULT_CENTER: [number, number] = [35.681236, 139.767125];
const DEBOUNCE_MS = 400;
const RESULT_LIST_ID = 'location-search-results';
const MISSING_CONTACT_EMAIL_MESSAGE =
  'サーバ側で NOMINATIM_CONTACT_EMAIL が設定されていません。Vercel の環境変数に実メールを追加してください';

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onPick }) => {
  useMapEvents({
    click(event) {
      onPick({
        placeName: `地図で指定した地点 ${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)}`,
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
};

const MapViewSync: React.FC<{ location?: CustomLocation }> = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      map.invalidateSize();
    }, 80);

    return () => window.clearTimeout(timeout);
  }, [map]);

  useEffect(() => {
    map.invalidateSize();

    if (location) {
      map.flyTo([location.lat, location.lng], Math.max(map.getZoom(), 14), {
        animate: true,
        duration: 0.6,
      });
    }
  }, [location, map]);

  return null;
};

const MapInteractionSync: React.FC<{ scrollWheelZoom: boolean }> = ({ scrollWheelZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (scrollWheelZoom) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [map, scrollWheelZoom]);

  return null;
};

const getGeocodeErrorMessage = (payload: any): string => {
  if (payload?.error?.code === 'missing_contact_email') {
    return MISSING_CONTACT_EMAIL_MESSAGE;
  }

  return payload?.error?.message || '場所検索に失敗しました。';
};

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  initialLocation,
  onClose,
  onClear,
  onConfirm,
}) => {
  const [query, setQuery] = useState(initialLocation?.placeName ?? '');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const [draftLocation, setDraftLocation] = useState<CustomLocation | undefined>(initialLocation);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScrollWheelEnabled, setIsScrollWheelEnabled] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  const center = useMemo<[number, number]>(() => {
    if (draftLocation) return [draftLocation.lat, draftLocation.lng];
    return DEFAULT_CENTER;
  }, [draftLocation]);

  const runSearch = useCallback(async (rawQuery: string, showEmptyError = false) => {
    const trimmedQuery = rawQuery.trim();
    if (!trimmedQuery) {
      requestRef.current?.abort();
      setResults([]);
      setActiveResultIndex(-1);
      if (showEmptyError) {
        setError('検索する場所名または住所を入力してください。');
      }
      return;
    }

    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(trimmedQuery)}`, {
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getGeocodeErrorMessage(payload));
      }

      if (requestRef.current !== controller) return;

      const nextResults = Array.isArray(payload?.results) ? payload.results : [];
      setResults(nextResults);
      setActiveResultIndex(nextResults.length > 0 ? 0 : -1);
      if (nextResults.length === 0) {
        setError('候補が見つかりませんでした。別の表記で検索してください。');
      }
    } catch (searchError: any) {
      if (searchError?.name === 'AbortError') return;
      setResults([]);
      setActiveResultIndex(-1);
      setError(searchError.message || '場所検索に失敗しました。');
    } finally {
      if (requestRef.current === controller) {
        setIsSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      requestRef.current?.abort();
      setResults([]);
      setActiveResultIndex(-1);
      setError(null);
      setIsSearching(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      void runSearch(trimmedQuery);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [query, runSearch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
    };
  }, []);

  const handleSelectResult = (result: GeocodeResult) => {
    setDraftLocation({
      placeName: result.displayName,
      lat: result.lat,
      lng: result.lng,
    });
  };

  const handleMarkerDragEnd = (event: any) => {
    const marker = event.target as L.Marker;
    const nextLatLng = marker.getLatLng();
    setDraftLocation((current) => ({
      placeName:
        current?.placeName ||
        `地図で指定した地点 ${nextLatLng.lat.toFixed(5)}, ${nextLatLng.lng.toFixed(5)}`,
      lat: nextLatLng.lat,
      lng: nextLatLng.lng,
    }));
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResultIndex((current) => {
        if (results.length === 0) return -1;
        return current < results.length - 1 ? current + 1 : 0;
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResultIndex((current) => {
        if (results.length === 0) return -1;
        return current > 0 ? current - 1 : results.length - 1;
      });
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (activeResultIndex >= 0 && results[activeResultIndex]) {
        handleSelectResult(results[activeResultIndex]);
        return;
      }

      void runSearch(query, true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-picker-title"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h2 id="location-picker-title" className="text-base font-bold text-white">
              地図からロケーションを選ぶ
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              検索候補・地図クリック・ピンのドラッグで撮影地を指定できます。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
            aria-label="ロケーション選択を閉じる"
          >
            閉じる
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 md:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="min-h-0 overflow-y-auto border-b border-zinc-800 p-4 md:border-b-0 md:border-r">
            <div className="space-y-3">
              <label htmlFor="location-search-input" className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                場所名 / 住所
              </label>
              <div className="flex gap-2">
                <input
                  id="location-search-input"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="例: 銀座, 大町市, Paris"
                  role="combobox"
                  aria-controls={RESULT_LIST_ID}
                  aria-expanded={results.length > 0}
                  aria-activedescendant={
                    activeResultIndex >= 0 ? `location-result-${activeResultIndex}` : undefined
                  }
                  className="min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => void runSearch(query, true)}
                  disabled={isSearching}
                  className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  {isSearching ? '検索中' : '検索'}
                </button>
              </div>
              <p className="text-[10px] leading-relaxed text-zinc-600">
                入力後 400ms で自動検索します。候補は ↑↓ と Enter でも選択できます。
              </p>

              {error && (
                <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-200">
                  {error}
                </p>
              )}

              {draftLocation && (
                <div className="rounded border border-blue-500/40 bg-blue-500/10 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-300">選択中</p>
                  <p className="mt-1 line-clamp-3 text-xs text-zinc-100">{draftLocation.placeName}</p>
                  <p className="mt-2 font-mono text-[10px] text-zinc-500">
                    {draftLocation.lat.toFixed(6)}, {draftLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}

              <div id={RESULT_LIST_ID} role="listbox" className="space-y-2">
                {results.map((result, index) => {
                  const isActive = index === activeResultIndex;

                  return (
                    <button
                      id={`location-result-${index}`}
                      key={`${result.lat}-${result.lng}-${result.displayName}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveResultIndex(index)}
                      onClick={() => handleSelectResult(result)}
                      className={`w-full rounded border p-3 text-left text-xs transition-colors ${
                        isActive
                          ? 'border-blue-500/70 bg-blue-500/15 text-blue-100'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-blue-500/60 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="line-clamp-3">{result.displayName}</span>
                      <span className="mt-2 block font-mono text-[10px] text-zinc-600">
                        {result.lat.toFixed(5)}, {result.lng.toFixed(5)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div
            className="relative h-[420px] min-h-[420px] overflow-hidden bg-zinc-900 md:h-[560px]"
            onMouseEnter={() => setIsScrollWheelEnabled(true)}
            onMouseLeave={() => setIsScrollWheelEnabled(false)}
            onFocus={() => setIsScrollWheelEnabled(true)}
          >
            <div className="pointer-events-none absolute right-3 top-3 z-[500] rounded bg-black/65 px-2 py-1 text-[10px] font-semibold text-zinc-200 backdrop-blur">
              {isScrollWheelEnabled ? 'ホイールズーム有効' : '地図上でホイールズーム'}
            </div>
            <LeafletMapContainer
              center={center}
              zoom={draftLocation ? 14 : 11}
              className="h-full w-full"
              style={{ height: '100%', minHeight: '420px', zIndex: 0 }}
              scrollWheelZoom={isScrollWheelEnabled}
              dragging
              touchZoom
              doubleClickZoom
              boxZoom
              keyboard
            >
              <LeafletTileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onPick={setDraftLocation} />
              <MapViewSync location={draftLocation} />
              <MapInteractionSync scrollWheelZoom={isScrollWheelEnabled} />
              {draftLocation && (
                <LeafletMarker
                  position={[draftLocation.lat, draftLocation.lng]}
                  draggable
                  eventHandlers={{ dragend: handleMarkerDragEnd }}
                />
              )}
            </LeafletMapContainer>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClear}
            className="rounded border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            クリアして閉じる
          </button>
          <button
            type="button"
            disabled={!draftLocation}
            onClick={() => draftLocation && onConfirm(draftLocation)}
            className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            確定してこの場所で生成
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
