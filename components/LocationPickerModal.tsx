import React, { useMemo, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { CustomLocation } from '../types';

type LeafletComponentProps = React.PropsWithChildren<Record<string, unknown>>;

const LeafletMapContainer = MapContainer as unknown as React.ComponentType<LeafletComponentProps>;
const LeafletTileLayer = TileLayer as unknown as React.ComponentType<LeafletComponentProps>;
const LeafletCircleMarker = CircleMarker as unknown as React.ComponentType<LeafletComponentProps>;

interface GeocodeResult {
  displayName: string;
  lat: number;
  lng: number;
  boundingbox?: string[];
}

interface LocationPickerModalProps {
  initialLocation?: CustomLocation;
  onClose: () => void;
  onConfirm: (location: CustomLocation) => void;
}

interface MapClickHandlerProps {
  onPick: (location: CustomLocation) => void;
}

const DEFAULT_CENTER: [number, number] = [35.681236, 139.767125];

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

  React.useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 13, { animate: true });
    }
  }, [location, map]);

  return null;
};

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  initialLocation,
  onClose,
  onConfirm,
}) => {
  const [query, setQuery] = useState(initialLocation?.placeName ?? '');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [draftLocation, setDraftLocation] = useState<CustomLocation | undefined>(initialLocation);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const center = useMemo<[number, number]>(() => {
    if (draftLocation) return [draftLocation.lat, draftLocation.lng];
    return DEFAULT_CENTER;
  }, [draftLocation]);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('検索する場所名または住所を入力してください。');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(trimmedQuery)}`);
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error?.message || '場所検索に失敗しました。');
      }

      const nextResults = Array.isArray(payload?.results) ? payload.results : [];
      setResults(nextResults);
      if (nextResults.length === 0) {
        setError('候補が見つかりませんでした。別の表記で検索してください。');
      }
    } catch (searchError: any) {
      setError(searchError.message || '場所検索に失敗しました。');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: GeocodeResult) => {
    setDraftLocation({
      placeName: result.displayName,
      lat: result.lat,
      lng: result.lng,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-picker-title"
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <h2 id="location-picker-title" className="text-base font-bold text-white">
              地図からロケーションを選ぶ
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              検索または地図クリックでピンを置き、撮影地の空気感をプロンプトへ反映します。
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

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 md:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="min-h-0 overflow-y-auto border-b border-zinc-800 p-4 md:border-b-0 md:border-r">
            <div className="space-y-3">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                場所名 / 住所
              </label>
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="例: 銀座, 大町市, Paris"
                  className="min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500"
                >
                  {isSearching ? '検索中' : '検索'}
                </button>
              </div>

              {error && (
                <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
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

              <div className="space-y-2">
                {results.map((result) => (
                  <button
                    key={`${result.lat}-${result.lng}-${result.displayName}`}
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full rounded border border-zinc-800 bg-zinc-900 p-3 text-left text-xs text-zinc-300 transition-colors hover:border-blue-500/60 hover:bg-zinc-800"
                  >
                    <span className="line-clamp-3">{result.displayName}</span>
                    <span className="mt-2 block font-mono text-[10px] text-zinc-600">
                      {result.lat.toFixed(5)}, {result.lng.toFixed(5)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="relative min-h-[420px]">
            <LeafletMapContainer center={center} zoom={draftLocation ? 13 : 11} className="h-full min-h-[420px] w-full">
              <LeafletTileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onPick={setDraftLocation} />
              <MapViewSync location={draftLocation} />
              {draftLocation && (
                <LeafletCircleMarker
                  center={[draftLocation.lat, draftLocation.lng]}
                  radius={10}
                  pathOptions={{
                    color: '#60a5fa',
                    fillColor: '#2563eb',
                    fillOpacity: 0.85,
                    weight: 3,
                  }}
                />
              )}
            </LeafletMapContainer>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            キャンセル
          </button>
          <button
            type="button"
            disabled={!draftLocation}
            onClick={() => draftLocation && onConfirm(draftLocation)}
            className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            この場所を使う
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
