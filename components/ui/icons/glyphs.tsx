import { solidIcon, strokeIcon } from './factories';

// ---- arrows and marks
export const ChevronRight = strokeIcon('ChevronRight', <polyline points="9 18 15 12 9 6" />);
export const ChevronLeft = strokeIcon('ChevronLeft', <polyline points="15 18 9 12 15 6" />);
export const ChevronDown = strokeIcon('ChevronDown', <polyline points="6 9 12 15 18 9" />);
// Six dots: a handle to drag something by.
export const Grip = strokeIcon(
  'Grip',
  <>
    <circle cx="9" cy="6" r="0.6" />
    <circle cx="15" cy="6" r="0.6" />
    <circle cx="9" cy="12" r="0.6" />
    <circle cx="15" cy="12" r="0.6" />
    <circle cx="9" cy="18" r="0.6" />
    <circle cx="15" cy="18" r="0.6" />
  </>,
);
export const Check = strokeIcon('Check', <polyline points="20 6 9 17 4 12" />);
export const Close = strokeIcon(
  'Close',
  <>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </>,
);
export const Plus = strokeIcon(
  'Plus',
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>,
);
export const Repeat = strokeIcon(
  'Repeat',
  <>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </>,
);
export const Pencil = strokeIcon(
  'Pencil',
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </>,
);
export const Copy = strokeIcon(
  'Copy',
  <>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
  </>,
);
export const Clock = strokeIcon(
  'Clock',
  <>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </>,
);
export const Info = strokeIcon(
  'Info',
  <>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16.5" />
    <line x1="12" y1="7.8" x2="12" y2="8" />
  </>,
);
export const Search = strokeIcon(
  'Search',
  <>
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" />
  </>,
);
export const Moon = strokeIcon('Moon', <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />);

// ---- navigation
export const Calendar = strokeIcon(
  'Calendar',
  <>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="8" y1="3" x2="8" y2="6" />
    <line x1="16" y1="3" x2="16" y2="6" />
  </>,
);
export const Book = strokeIcon(
  'Book',
  <>
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
    <path d="M5 17h14" />
  </>,
);
export const Notebook = strokeIcon(
  'Notebook',
  <>
    <path d="M5 4h11a3 3 0 0 1 3 3v13H7a2 2 0 0 1-2-2z" />
    <line x1="9" y1="9" x2="15" y2="9" />
    <line x1="9" y1="13" x2="14" y2="13" />
  </>,
);
// The Chronicle: a quill with a star, writing down how it felt.
export const Quill = strokeIcon(
  'Quill',
  <>
    <path d="M18.5 4.5c-6 1-9.6 5.2-10.8 11.3 5.9-1.1 10-4.9 10.8-11.3z" />
    <path d="M7.7 15.8 14 9.5" />
    <path d="M7.7 15.8 5 19.5" />
    <path d="M6.8 4.2c.31 1.61.99 2.29 2.6 2.6-1.61.31-2.29.99-2.6 2.6-.31-1.61-.99-2.29-2.6-2.6 1.61-.31 2.29-.99 2.6-2.6z" />
    <path d="M11 20h8" />
  </>,
);
// The Spellbook: a workout card with a spell card fanned out behind it, its star tucked under the front card.
// Weights vary by part: the dumbbell is boldest, the card behind lightest. Solid parts fill with the icon colour.
export const SpellCards = strokeIcon(
  'SpellCards',
  <>
    <path
      d="M9.79 5.59A2 2 0 0 1 10.93 4.81L17.24 3.24A2 2 0 0 1 19.66 4.69L22.32 15.37A2 2 0 0 1 20.87 17.79L14.56 19.36A2 2 0 0 1 13.91 19.41"
      strokeWidth={1.25}
    />
    <path
      d="M13.9 11.24C14.8 10.43 15.11 9.4 15.03 7.81C15.99 9.87 17.12 10.55 19.39 10.43C17.33 11.39 16.65 12.52 16.77 14.79C16.05 13.24 15.23 12.47 13.9 12.24Z"
      fill="currentColor"
      stroke="none"
    />
    <rect x="2.5" y="6.5" width="10.5" height="15" rx="2" strokeWidth={1.75} />
    <g transform="translate(7.75 14) rotate(-40)">
      <path d="M-1.79 0h3.58" strokeWidth={2.13} />
      <g fill="currentColor" stroke="none">
        <rect x="1.68" y="-2.74" width="1.68" height="5.49" rx=".62" />
        <rect x="3.08" y="-1.74" width="1.4" height="3.47" rx=".5" />
        <rect x="-3.36" y="-2.74" width="1.68" height="5.49" rx=".62" />
        <rect x="-4.48" y="-1.74" width="1.4" height="3.47" rx=".5" />
      </g>
    </g>
  </>,
);
export const BarChart = strokeIcon(
  'BarChart',
  <>
    <line x1="5" y1="20" x2="5" y2="13" />
    <line x1="12" y1="20" x2="12" y2="8" />
    <line x1="19" y1="20" x2="19" y2="4" />
  </>,
);
export const User = strokeIcon(
  'User',
  <>
    <circle cx="12" cy="8.5" r="3.6" />
    <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
  </>,
);

export const SignOut = strokeIcon(
  'SignOut',
  <>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
    <polyline points="10 8 6 12 10 16" />
    <line x1="6" y1="12" x2="16" y2="12" />
  </>,
);

// ---- training
export const Dumbbell = strokeIcon(
  'Dumbbell',
  <>
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="4" y1="9" x2="4" y2="15" />
    <line x1="20" y1="9" x2="20" y2="15" />
    <line x1="7" y1="9" x2="7" y2="15" />
    <line x1="17" y1="9" x2="17" y2="15" />
  </>,
);
export const DumbbellUpright = strokeIcon(
  'DumbbellUpright',
  <>
    <line x1="12" y1="6" x2="12" y2="18" />
    <line x1="9" y1="4" x2="15" y2="4" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </>,
);
export const DumbbellSmall = strokeIcon(
  'DumbbellSmall',
  <>
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="6" y1="9" x2="6" y2="15" />
    <line x1="18" y1="9" x2="18" y2="15" />
  </>,
);
export const Bike = strokeIcon(
  'Bike',
  <>
    <circle cx="6" cy="17" r="3.4" />
    <circle cx="18" cy="17" r="3.4" />
    <path d="M6 17l5-8h5l2 8" />
    <path d="M10 9h4" />
  </>,
);
export const Waves = strokeIcon(
  'Waves',
  <>
    <path d="M2 10c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0 4.4-2 6.6 0" />
    <path d="M2 15c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0 4.4-2 6.6 0" />
  </>,
);
export const Swirl = strokeIcon(
  'Swirl',
  <>
    <path d="M3 8c4-3 8-1 8 2s-3 4-6 2" />
    <path d="M3 15c5-2 11 0 15 3s6-1 5-5" />
  </>,
);
export const Flame = solidIcon(
  'Flame',
  'M12.5 2c1.2 3.4 3.5 5.6 3.5 9.2a4.5 4.5 0 1 1-9 0c0-2.6 1.2-4 1.9-5.6.4 1.6 1.3 2.2 1.6 3.4.5-1.3.6-3.5 2-7z',
);
export const Mountain = solidIcon('Mountain', 'M2 20 L9 8 L13 14 L17 6 L22 20 Z');
