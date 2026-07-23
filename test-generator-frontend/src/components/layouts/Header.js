/**
 * Top application header shell.
 * Structural only — navigation items and auth state come later.
 */
export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-zinc-900">
          Test Generator
        </span>
        {/* Nav / account actions will mount here */}
      </div>
    </header>
  );
}
