/**
 * Landing page — structural placeholder only (no product logic yet).
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Test Generator
      </h1>
      <p className="mt-3 max-w-lg text-lg text-zinc-600">
        Architecture scaffold is ready. Feature modules and API integration
        can be built on top of this structure.
      </p>
    </main>
  );
}
