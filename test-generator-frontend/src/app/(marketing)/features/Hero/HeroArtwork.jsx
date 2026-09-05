/**
 * Inline SVG education artwork — no external assets.
 * Abstract desk / paper / marks composition.
 */
export function HeroArtwork() {
  return (
    <div className="relative mx-auto aspect-square h-full max-h-full w-full max-w-lg lg:ml-auto">
      <div
        aria-hidden="true"
        className="absolute inset-6 rounded-[var(--radius-2xl)] border border-neutral-200 bg-neutral-0 shadow-sm"
      />

      <svg
        viewBox="0 0 420 420"
        className="relative z-10 h-full w-full"
        role="img"
        aria-label="Abstract illustration of test papers and learning tools"
      >
        <defs>
          <linearGradient id="heroPaper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3f7eb" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id="heroAccent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6f9a35" />
            <stop offset="100%" stopColor="#587b2a" />
          </linearGradient>
        </defs>

        {/* Soft ground ring */}
        <circle cx="210" cy="220" r="150" fill="#e4eed4" opacity="0.55" />
        <circle cx="210" cy="220" r="118" fill="#f7f7f5" opacity="0.9" />

        {/* Back paper */}
        <g className="animate-float-slow origin-center" style={{ transformOrigin: "210px 210px" }}>
          <rect
            x="118"
            y="96"
            width="150"
            height="190"
            rx="12"
            fill="url(#heroPaper)"
            stroke="#e3e3de"
            strokeWidth="2"
            transform="rotate(-8 193 191)"
          />
          <path
            d="M140 140h90M140 168h78M140 196h85M140 224h60"
            stroke="#cfcfc8"
            strokeWidth="6"
            strokeLinecap="round"
            transform="rotate(-8 193 191)"
          />
        </g>

        {/* Front paper */}
        <g className="animate-float origin-center" style={{ transformOrigin: "240px 230px" }}>
          <rect
            x="168"
            y="118"
            width="160"
            height="200"
            rx="12"
            fill="#ffffff"
            stroke="#e3e3de"
            strokeWidth="2"
            transform="rotate(6 248 218)"
          />
          <path
            d="M192 160h100M192 190h88M192 220h96M192 250h70"
            stroke="#c9ddaa"
            strokeWidth="6"
            strokeLinecap="round"
            transform="rotate(6 248 218)"
          />
          {/* Check marks */}
          <path
            d="M300 158l8 8 14-16"
            fill="none"
            stroke="#587b2a"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(6 248 218)"
          />
          <path
            d="M300 218l8 8 14-16"
            fill="none"
            stroke="#587b2a"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(6 248 218)"
          />
        </g>

        {/* Pencil */}
        <g className="animate-float-delayed" style={{ transformOrigin: "320px 300px" }}>
          <rect
            x="286"
            y="268"
            width="18"
            height="96"
            rx="4"
            fill="url(#heroAccent)"
            transform="rotate(35 295 316)"
          />
          <polygon
            points="292,360 304,360 298,378"
            fill="#2f2f2b"
            transform="rotate(35 295 316)"
          />
        </g>

        {/* Floating badge */}
        <g className="animate-float">
          <rect x="72" y="250" width="72" height="36" rx="10" fill="#587b2a" />
          <text
            x="108"
            y="273"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="13"
            fontFamily="var(--font-plus-jakarta), sans-serif"
            fontWeight="600"
          >
            A+
          </text>
        </g>
      </svg>
    </div>
  );
}
