/**
 * Icon component with all SVG icons used in the app
 */
export default function Icon({ name, size = 20, fill = "none", stroke = "currentColor", className = "" }) {
  const paths = {
    home: (
      <>
        <path d="M3 12l9-9 9 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21V12h6v9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" strokeWidth="2" />
        <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    library: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
      </>
    ),
    play: <polygon points="6,3 20,12 6,21" fill="currentColor" stroke="none" />,
    pause: (
      <>
        <rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none" rx="1" />
        <rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none" rx="1" />
      </>
    ),
    prev: (
      <>
        <polygon points="19,4 12,12 19,20" fill="currentColor" stroke="none" />
        <rect x="5" y="4" width="2" height="16" fill="currentColor" stroke="none" />
      </>
    ),
    next: (
      <>
        <polygon points="5,4 12,12 5,20" fill="currentColor" stroke="none" />
        <rect x="17" y="4" width="2" height="16" fill="currentColor" stroke="none" />
      </>
    ),
    shuffle: (
      <path
        d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    repeat: (
      <>
        <path d="M17 1l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 11V9a4 4 0 014-4h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 23l-4-4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 13v2a4 4 0 01-4 4H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    heart: (
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        strokeWidth="2"
        fill={fill}
      />
    ),
    volume: (
      <>
        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" />
        <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    mute: (
      <>
        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" stroke="none" />
        <line x1="23" y1="9" x2="17" y2="15" strokeWidth="2" strokeLinecap="round" />
        <line x1="17" y1="9" x2="23" y2="15" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l12-2v13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="18" r="3" strokeWidth="2" />
        <circle cx="18" cy="16" r="3" strokeWidth="2" />
      </>
    ),
    upload: (
      <>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    folder: (
      <path
        d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    menu: (
      <>
        <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    queue: (
      <>
        <path d="M21 15V6M18.5 18a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" strokeWidth="2" />
        <path d="M12 12H3M16 6H3M12 18H3" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" strokeWidth="2" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2" />
      </>
    ),
    chevronLeft: (
      <polyline points="15 18 9 12 15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    chevronDown: (
      <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
    externalLink: (
      <>
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="15 3 21 3 21 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="14" x2="21" y2="3" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      style={{ flexShrink: 0 }}
      className={className}
    >
      {paths[name] || null}
    </svg>
  );
}
