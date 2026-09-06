/**
 * Asymmetrical flowing divider into the next About section.
 */

const CURVE_PATH =
  "M0,48 C180,18 320,10 480,28 C720,58 820,110 1080,92 C1260,80 1360,70 1440,88";

export function AboutDivider() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 leading-[0]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-16 w-full sm:h-20 lg:h-24"
      >
        <path
          d={`${CURVE_PATH} L1440,120 L0,120 Z`}
          className="fill-neutral-0"
        />
        <path
          d={CURVE_PATH}
          fill="none"
          stroke="#000000"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
