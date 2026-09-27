// Provider marks. These are drawn approximations. Replace them with the official assets, and follow each provider's
// sign-in button guidelines for minimum size, clear space and permitted label text, before this goes live.

export const GoogleMark = ({ size = 19 }: { size?: number }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} style={{ flex: 'none' }}>
    <path fill="#4285F4" d="M23 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6.1a5.3 5.3 0 0 1-2.3 3.4v2.8h3.6c2.1-2 3.3-4.9 3.3-8.2z" />
    <path fill="#34A853" d="M12 23.5c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v3A11.4 11.4 0 0 0 12 23.5z" />
    <path fill="#FBBC05" d="M5.8 14.6a6.9 6.9 0 0 1 0-4.4v-3H2.1a11.5 11.5 0 0 0 0 10.4z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11.4 11.4 0 0 0 2.1 7.2l3.7 3a6.8 6.8 0 0 1 6.2-4.8z" />
  </svg>
);

export const AppleMark = ({ size = 19 }: { size?: number }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} style={{ flex: 'none' }}>
    <path
      fill="currentColor"
      d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8s-1.7-.8-2.8-.8C7.4 7.6 5.8 8.6 5 10.2c-1.6 2.8-.4 7 1.1 9.2.8 1.1 1.7 2.3 2.9 2.2 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.7-1-2.7-4.1zM14.3 5.9c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1 1.8-.9 2.8 1 .1 2-.5 2.7-1.3z"
    />
  </svg>
);
