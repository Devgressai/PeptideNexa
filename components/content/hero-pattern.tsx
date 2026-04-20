type HeroPatternProps = {
  className?: string;
};

/**
 * Subtle molecular-lattice background for the homepage hero. Rendered as an
 * inline SVG so it ships without a network request and scales crisply at any
 * viewport. Opacity is low enough to stay decorative — it never competes with
 * the type. Uses currentColor so it inherits the section's ink, keeping the
 * pattern tonally consistent with the page.
 */
export function HeroPattern({ className }: HeroPatternProps) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="hero-fade" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.04" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.015" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <pattern id="lattice" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.05" />
          <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.04" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#hero-fade)" className="text-brand" />
      <rect width="800" height="600" fill="url(#lattice)" className="text-ink" />
      {/* A handful of larger "molecule" nodes to break up the grid — placed by
          hand so the composition feels intentional rather than random. */}
      <g opacity="0.12" className="text-brand">
        <circle cx="120" cy="140" r="3" fill="currentColor" />
        <circle cx="160" cy="180" r="2" fill="currentColor" />
        <line x1="120" y1="140" x2="160" y2="180" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="640" cy="220" r="3" fill="currentColor" />
        <circle cx="680" cy="260" r="2" fill="currentColor" />
        <line x1="640" y1="220" x2="680" y2="260" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="520" cy="440" r="2" fill="currentColor" />
        <circle cx="560" cy="460" r="3" fill="currentColor" />
        <line x1="520" y1="440" x2="560" y2="460" stroke="currentColor" strokeWidth="0.6" />
      </g>
    </svg>
  );
}
