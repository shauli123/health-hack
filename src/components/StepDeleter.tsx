import { useState } from 'react'
import type { LogEntry } from '../types/health'
import { openHealthConnectSettings } from '../services/healthConnect'

interface StepDeleterProps {
  onLog: (entry: LogEntry) => void
}

export function StepDeleter({ onLog }: StepDeleterProps) {
  const [loading, setLoading] = useState(false)

  async function handleOpenSettings() {
    setLoading(true)
    try {
      await openHealthConnectSettings()
      onLog({
        id: crypto.randomUUID(),
        type: 'info',
        message: 'Health Connect settings opened. Delete unwanted step records manually from there.',
        timestamp: new Date(),
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      onLog({
        id: crypto.randomUUID(),
        type: 'error',
        message: `Failed to open Health Connect settings: ${msg}`,
        timestamp: new Date(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card border-danger-border/40">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400">
          Danger Zone
        </h2>
      </div>
      <p className="mb-5 text-xs text-zinc-500">
        Open Health Connect settings to review, manage, or delete injected step records.
      </p>

      <button
        type="button"
        className="btn-danger"
        onClick={handleOpenSettings}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Opening Settings...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Open Health Connect Settings
          </>
        )}
      </button>
    </div>
  )
}
