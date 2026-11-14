'use client';

import { useEffect, useRef, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map as MapLibre, Marker } from 'maplibre-gl';
import { ACCENTS, paletteFor, type Accent } from '@moonshot/design-system/colors';

// OpenFreeMap's tiles: free, with no account or key. Positron is the quiet one, so the glimmers stand out.
const STYLE = 'https://tiles.openfreemap.org/styles/positron';

type Glim = { key: string; lat: number; lon: number; color: 'slate' | 'teal' | 'periwinkle' | 'gold'; rarity: string; target?: boolean };

// The map is light in every theme, so what's drawn on it takes the light palette's values (for the color theme in
// use), not the page's CSS variables, which turn pale in Plum dusk and would be faint on a light map.
const lightPalette = () => {
  const a = typeof document !== 'undefined' ? document.documentElement.dataset.accent : undefined;
  return paletteFor('light', (ACCENTS.some((x) => x.name === a) ? a : 'pink') as Accent);
};

// A glimmer: a four-point star in its rarity's deep shade, on a faint halo in the rarity's own color (25%), with no
// outline. The star is 3.7:1 or more against the halo, and more against the map.
const glimmerEl = (g: Glim) => {
  const p = lightPalette();
  const halo = p[g.color];
  const deep = g.color === 'slate' ? p.slate : p[(g.color + 'Deep') as 'tealDeep' | 'periwinkleDeep' | 'goldDeep'];
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  // The one a Star Compass points to has a ring around it.
  el.style.cssText = `width:26px;height:26px;display:grid;place-items:center;border-radius:999px;background:color-mix(in srgb, ${halo} 25%, transparent)${g.target ? `;box-shadow:0 0 0 3px ${deep}` : ''}`;
  el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="${deep}"/></svg>`;
  return el;
};
const youEl = () => {
  const p = lightPalette();
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = `width:18px;height:18px;border-radius:999px;background:${p.pink};border:3px solid ${p.surface};box-shadow:0 0 0 10px color-mix(in srgb, ${p.pink} 18%, transparent)`;
  return el;
};

const FOLLOW_PAUSE_MS = 20_000;

/** The map on a session being collected: where you are, and today's glimmers around you. It follows you as you go, pausing for a bit after it's moved by hand.
 * The glimmers are also said in words beside it, so the map itself is hidden from screen readers. */
export function MoonwalkMap({ lat, lon, glimmers }: { lat: number; lon: number; glimmers: Glim[] }) {
  const box = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapLibre | null>(null);
  const you = useRef<Marker | null>(null);
  const marks = useRef<Map<string, Marker>>(new Map());
  const lib = useRef<typeof import('maplibre-gl') | null>(null);
  const lookedAt = useRef(0);
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
          // On a phone one finger scrolls the page and two move the map (a hint says so when one finger tries); on a
          // computer the wheel scrolls the page and Ctrl/⌘ + wheel zooms. Dragging with a mouse still moves it.
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
        });
        mp.on('error', () => undefined);
        // Moved by hand: stop following for a while, so there's time to look around.
        mp.on('movestart', (e) => {
          if ((e as { originalEvent?: unknown }).originalEvent) lookedAt.current = Date.now();
        });
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
    // It follows you, unless the map was moved by hand in the last 20 seconds.
    if (Date.now() - lookedAt.current > FOLLOW_PAUSE_MS) map.current.easeTo({ center: [lon, lat], duration: 600 });
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
