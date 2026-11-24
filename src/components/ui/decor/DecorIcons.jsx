export function AsteriskIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className} {...props}>
      <g stroke="currentColor" strokeWidth="19" strokeLinecap="round">
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="15.4" y1="30" x2="84.6" y2="70" />
        <line x1="15.4" y1="70" x2="84.6" y2="30" />
      </g>
    </svg>
  );
}

export function BlobIcon({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 136 104"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M34 8c14-9 33-8 44 3 12-7 31-3 38 11 11 4 18 17 14 30-3 11-12 18-23 19-6 12-22 18-36 13-9 6-24 5-31-4C18 83 8 71 12 58 4 47 8 28 20 22c3-6 8-11 14-14z" />
    </svg>
  );
}
