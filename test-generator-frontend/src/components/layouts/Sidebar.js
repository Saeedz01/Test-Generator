/**
 * Dashboard sidebar shell.
 * Structural only — links and active states come later.
 */
export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-zinc-200 bg-zinc-50 p-4 md:block">
      <nav className="flex flex-col gap-2 text-sm text-zinc-600">
        {/* Feature nav links will mount here via ROUTES constants */}
        <span className="font-medium text-zinc-400">Navigation</span>
      </nav>
    </aside>
  );
}
