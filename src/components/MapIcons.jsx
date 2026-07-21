const ICON_PATHS = {
  "alpha-pal": (
    <>
      <path d="m4 8 3.2 2.4L12 5l4.8 5.4L20 8l-1.4 9.5H5.4L4 8Z" />
      <path d="M7 20h10" />
    </>
  ),
  "human-boss": (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 19c.7-4 2.8-6 6.5-6s5.8 2 6.5 6" />
      <path d="M12 2v2M3 8h2m14 0h2" />
    </>
  ),
  special: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5 5.5-2.1Z" />
    </>
  ),
  quest: (
    <>
      <path d="M6 21V4" />
      <path d="M7 5h10l-2 3 2 3H7" />
    </>
  ),
  "wild-spawn": (
    <>
      <path d="M19 5C11 5 6 9.2 6 15.5c0 2.3 1.5 3.5 3.6 3.5C15.8 19 19 13.4 19 5Z" />
      <path d="M5 20c2.4-4.4 5.5-7.3 10-10" />
    </>
  ),
  "fast-travel": (
    <>
      <path d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  dungeon: (
    <>
      <path d="M4 20V11a8 8 0 0 1 16 0v9" />
      <path d="M8 20v-8a4 4 0 0 1 8 0v8M3 20h18" />
    </>
  ),
  chest: (
    <>
      <path d="M4 10h16v10H4zM3 7h18v4H3z" />
      <path d="M12 10v10m-2-6h4" />
    </>
  ),
  egg: (
    <path d="M18 14.5c0 4-2.7 6.5-6 6.5s-6-2.5-6-6.5C6 10 8.7 3 12 3s6 7 6 11.5Z" />
  ),
  effigy: (
    <>
      <circle cx="12" cy="7" r="2.5" />
      <path d="M8 20h8l-1-7H9l-1 7Zm4-7V9.5M4 6h2m12 0h2M6.5 2.5 8 4m8-1.5L14.5 4" />
    </>
  ),
  "skill-fruit": (
    <>
      <path d="M12 8c-5-3-8 1-6.5 5.5C7 18 10 20 12 20s5-2 6.5-6.5C20 9 17 5 12 8Z" />
      <path d="M12 8c0-3 2-5 5-5-1 3-2.7 4.5-5 5Zm0 0c-1-2-2.7-3-5-3" />
    </>
  ),
  note: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M15 3v4h4M9 11h6m-6 4h6" />
    </>
  ),
  resource: (
    <>
      <path d="m5 4 4 4m-2-5 3 3-7 7-2-2 6-8Zm4 7 9 9" />
      <path d="m15 17 3-3 3 3-3 3" />
    </>
  ),
  merchant: (
    <>
      <path d="M5 9v11h14V9M4 4h16l1 5H3l1-5Z" />
      <path d="M8 20v-6h5v6m3-6h1" />
    </>
  ),
  npc: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3.8 2.5-5.8 5.5-5.8 1.5 0 2.7.5 3.6 1.4" />
      <path d="M15 9h6v5h-3l-2.5 2v-2H15V9Z" />
    </>
  ),
  "map-cluster": (
    <>
      <rect x="4" y="4" width="8" height="8" rx="2" />
      <rect x="12" y="12" width="8" height="8" rx="2" />
      <path d="M14 6h4v4M6 14v4h4" />
    </>
  ),
};

export function MapCategoryIcon({ category, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[category] || <circle cx="12" cy="12" r="5" />}
    </svg>
  );
}

export function MapControlIcon({ name }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    fit: (
      <>
        <path d="M8 4H4v4m12-4h4v4M8 20H4v-4m12 4h4v-4" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
