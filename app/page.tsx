import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl font-bold tracking-tight text-white mb-3">
          Marchitect
        </h1>
        <p className="text-zinc-400 text-lg mb-10">
          Marketing Operating System
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Sign In
          </Link>
          <Link
            href="/audit"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-700 px-6 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            Take the Audit
          </Link>
        </div>
      </div>
    </div>
  )
}
