/**
 * Asymmetrical flowing divider — left higher, right lower.
 * Soft cubic path (not a sharp triangle) so the next section continues cleanly.
 */
export function HeroDivider() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 leading-[0]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-16 w-full sm:h-20 lg:h-24"
      >
        <path
          d="M0,48 C180,18 320,10 480,28 C720,58 820,110 1080,92 C1260,80 1360,70 1440,88 L1440,120 L0,120 Z"
          className="fill-neutral-0"
        />
      </svg>
    </div>
  );
}
