/**
 * MapSearchBox — Nominatim geocoding search with debounced autocomplete.
 * Lets users type a place name, see suggestions, and add a new stop.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Search, Plus, Loader2 } from "lucide-react";

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: { city?: string; town?: string; village?: string; state?: string; country?: string };
}

interface MapSearchBoxProps {
  onAddStop: (place: { name: string; latitude: number; longitude: number }) => void;
}

export default function MapSearchBox({ onAddStop }: MapSearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`,
        { headers: { "Accept-Language": "en" } }
      );
      if (!response.ok) throw new Error("Geocoding request failed");
      const data: SearchResult[] = await response.json();
      if (data.length === 0) setError("No places found. Try a different search.");
      setResults(data);
    } catch {
      setError("Search unavailable. Check your connection and try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (query.length >= 2) {
      timerRef.current = setTimeout(() => search(query), 400);
    } else {
      setResults([]);
      setError("");
    }
    return () => clearTimeout(timerRef.current);
  }, [query, search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const placeName = (r: SearchResult) => {
    const addr = r.address;
    return addr?.city || addr?.town || addr?.village || r.display_name.split(",")[0];
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2 shadow-sm">
        <Search size={16} className="text-[var(--gold)]" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search a city or place to add…"
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[var(--navy)] outline-none placeholder:text-[var(--ink-muted)]"
          aria-label="Search for a place to add as a stop"
        />
        {loading && <Loader2 size={16} className="animate-spin text-[var(--ink-muted)]" />}
      </div>
      {open && (results.length > 0 || error) && (
        <div className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-64 overflow-y-auto rounded-xl border border-[var(--line)] bg-white shadow-lg">
          {error && (
            <p className="px-4 py-3 text-xs font-semibold text-red-500">{error}</p>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.lat}-${r.lon}-${i}`}
              onClick={() => {
                onAddStop({ name: placeName(r), latitude: parseFloat(r.lat), longitude: parseFloat(r.lon) });
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--sand)] transition-colors"
            >
              <MapPin size={14} className="shrink-0 text-[var(--gold)]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[var(--navy)]">{placeName(r)}</p>
                <p className="truncate text-xs text-[var(--ink-muted)]">{r.display_name}</p>
              </div>
              <Plus size={14} className="shrink-0 text-[var(--navy)]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
