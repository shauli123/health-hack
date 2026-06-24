export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          HealthHack
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Health Connect Step Simulator
        </p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800">
        <svg className="h-5 w-5 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    </header>
  )
}
