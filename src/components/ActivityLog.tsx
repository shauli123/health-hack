import type { LogEntry } from '../types/health'

interface ActivityLogProps {
  logs: LogEntry[]
}

export function ActivityLog({ logs }: ActivityLogProps) {
  if (logs.length === 0) {
    return (
      <div className="card">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-zinc-600" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Activity Log
          </h2>
        </div>
        <p className="py-6 text-center text-sm text-zinc-600">
          No activity yet. Ingest or delete steps to see logs here.
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-cyan" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Activity Log
          </h2>
        </div>
        <span className="text-xs text-zinc-600">{logs.length} entries</span>
      </div>

      <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
        {logs.map((entry) => (
          <div key={entry.id} className="log-entry">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 text-base ${
                    entry.type === 'success'
                      ? 'text-accent-emerald'
                      : entry.type === 'error'
                        ? 'text-red-400'
                        : 'text-accent-cyan'
                  }`}
                >
                  {entry.type === 'success' ? '✓' : entry.type === 'error' ? '✗' : '→'}
                </span>
                <p
                  className={`text-sm leading-snug ${
                    entry.type === 'error' ? 'text-red-300' : 'text-zinc-300'
                  }`}
                >
                  {entry.message}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-zinc-600">
                {entry.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
