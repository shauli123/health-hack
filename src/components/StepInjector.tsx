import { useState, useCallback } from 'react'
import type { TimePreset, LogEntry } from '../types/health'
import { injectSteps } from '../services/healthConnect'

const PRESETS = [
  { label: '+2,000', value: 2000 },
  { label: '+5,000', value: 5000 },
  { label: '+10,000', value: 10000 },
]

const TIME_PRESETS: { label: string; value: TimePreset }[] = [
  { label: 'Past 15 mins', value: '15min' },
  { label: 'Past 1 hour', value: '1hour' },
  { label: 'Past 4 hours', value: '4hours' },
]

interface StepInjectorProps {
  onLog: (entry: LogEntry) => void
}

export function StepInjector({ onLog }: StepInjectorProps) {
  const [stepCount, setStepCount] = useState<number>(5000)
  const [timePreset, setTimePreset] = useState<TimePreset>('1hour')
  const [loading, setLoading] = useState(false)

  const handlePreset = useCallback((value: number) => {
    setStepCount((prev) => prev + value)
  }, [])

  async function handleSync() {
    if (stepCount < 1) {
      onLog({
        id: crypto.randomUUID(),
        type: 'error',
        message: 'Step count must be at least 1.',
        timestamp: new Date(),
      })
      return
    }

    setLoading(true)
    try {
      const inserted = await injectSteps(stepCount, timePreset)
      onLog({
        id: crypto.randomUUID(),
        type: 'success',
        message: `Successfully wrote ${inserted} step record${inserted !== 1 ? 's' : ''} over the selected time range.`,
        timestamp: new Date(),
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      onLog({
        id: crypto.randomUUID(),
        type: 'error',
        message: `Injection failed: ${msg}`,
        timestamp: new Date(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent-emerald" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Step Injector
        </h2>
      </div>
      <p className="mb-5 text-xs text-zinc-500">
        Inject simulated step count records into Health Connect.
      </p>

      <div className="mb-5">
        <label className="mb-2 block text-xs font-medium text-zinc-400">
          Step Count
        </label>
        <input
          type="number"
          min={1}
          max={100000}
          value={stepCount}
          onChange={(e) => setStepCount(Math.max(1, Number(e.target.value) || 0))}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-lg font-bold text-white outline-none transition-colors focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald/30"
          disabled={loading}
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            className="preset-btn"
            onClick={() => handlePreset(p.value)}
            disabled={loading}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TIME_PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            className={`selector-btn ${timePreset === p.value ? 'active' : ''}`}
            onClick={() => setTimePreset(p.value)}
            disabled={loading}
          >
            {p.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={handleSync}
        disabled={loading || stepCount < 1}
      >
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
            Syncing...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync Steps
          </>
        )}
      </button>
    </div>
  )
}
