'use client';

import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map as MapLibre, Marker } from 'maplibre-gl';

// OpenFreeMap's tiles: free, with no account or key. Positron is the quiet one, so the glimmers stand out.
const STYLE = 'https://tiles.openfreemap.org/styles/positron';

type Glim = { key: string; lat: number; lon: number; fill: string; rarity: string };

const glimmerEl = (g: Glim) => {
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = `width:26px;height:26px;display:grid;place-items:center;border-radius:999px;background:color-mix(in srgb, ${g.fill} 30%, transparent)`;
  el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="${g.fill}" stroke="var(--color-surface)" stroke-width="1"/></svg>`;
  return el;
};
const youEl = () => {
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText =
    'width:18px;height:18px;border-radius:999px;background:var(--color-pink);border:3px solid var(--color-surface);box-shadow:0 0 0 10px color-mix(in srgb, var(--color-pink) 18%, transparent)';
  return el;
};

/** The map on a session being collected: where you are, and today's glimmers around you. It follows you as you go.
 * The glimmers are also said in words beside it, so the map itself is hidden from screen readers. */
export function MoonwalkMap({ lat, lon, glimmers }: { lat: number; lon: number; glimmers: Glim[] }) {
  const box = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibre | null>(null);
  const you = useRef<Marker | null>(null);
  const marks = useRef<Map<string, Marker>>(new Map());
  const lib = useRef<typeof import('maplibre-gl') | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // The map library is big, so it loads only when a map is shown.
  useEffect(() => {
    let gone = false;
    const placed = marks.current;
    import('maplibre-gl')
      .then((m) => {
        if (gone || !box.current) return;
        lib.current = m;
        const mp = new m.Map({
          container: box.current,
          style: STYLE,
          center: [lon, lat],
          zoom: 16,
          attributionControl: { compact: true },
          dragRotate: false,
          pitchWithRotate: false,
        });
        mp.on('error', () => undefined);
        map.current = mp;
        you.current = new m.Marker({ element: youEl() }).setLngLat([lon, lat]).addTo(mp);
        setReady(true);
      })
      .catch(() => setFailed(true));
    return () => {
      gone = true;
      map.current?.remove();
      map.current = null;
      placed.clear();
    };
    // Made once: the effects below follow the position and the glimmers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !map.current) return;
    you.current?.setLngLat([lon, lat]);
    map.current.easeTo({ center: [lon, lat], duration: 600 });
  }, [ready, lat, lon]);

  useEffect(() => {
    const m = lib.current;
    if (!ready || !map.current || !m) return;
    const keep = new Set(glimmers.map((g) => g.key));
    marks.current.forEach((mk, k) => {
      if (!keep.has(k)) {
        mk.remove();
        marks.current.delete(k);
      }
    });
    glimmers.forEach((g) => {
      if (!marks.current.has(g.key)) marks.current.set(g.key, new m.Marker({ element: glimmerEl(g) }).setLngLat([g.lon, g.lat]).addTo(map.current!));
    });
  }, [ready, glimmers]);

  if (failed) return null;
  return (
    <div
      ref={box}
      aria-hidden="true"
      style={{ height: 240, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginTop: 'var(--space-3)', background: 'var(--color-mist)' }}
    />
  );
}
