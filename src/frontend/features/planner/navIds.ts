// The five places the navigation goes, in its order. Their names, addresses and icons are in nav.tsx.
export const NAV_IDS = ['day', 'diaryList', 'arsenal', 'summary', 'profile'] as const;
export type NavId = (typeof NAV_IDS)[number];
