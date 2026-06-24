import { useState, useEffect, useCallback } from 'react'
import type { LogEntry } from './types/health'
import { checkAvailability, requestWritePermissions } from './services/healthConnect'
import { Header } from './components/Header'
import { StepInjector } from './components/StepInjector'
import { StepDeleter } from './components/StepDeleter'
import { ActivityLog } from './components/ActivityLog'

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [hcStatus, setHcStatus] = useState<string>('Checking...')
  const [permError, setPermError] = useState<string | null>(null)
  const [permGranted, setPermGranted] = useState(false)

  const appendLog = useCallback((entry: LogEntry) => {
    setLogs((prev) => [entry, ...prev])
  }, [])

  useEffect(() => {
    checkAvailability()
      .then((res) => setHcStatus(res.status))
      .catch(() => setHcStatus('Error'))
  }, [])

  async function handleRequestPermissions() {
    setPermError(null)
    const result = await requestWritePermissions()
    if (result.granted) {
      setPermGranted(true)
      appendLog({
        id: crypto.randomUUID(),
        type: 'success',
        message: 'Health Connect permissions granted.',
        timestamp: new Date(),
      })
    } else {
      setPermGranted(false)
      const msg = result.error ?? 'Unknown error'
      setPermError(msg)
      appendLog({
        id: crypto.randomUUID(),
        type: 'error',
        message: `Permission request failed: ${msg}`,
        timestamp: new Date(),
      })
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <Header />

      {/* HC Availability Status */}
      <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
        hcStatus === 'Available'
          ? 'border-emerald-800 bg-emerald-900/20 text-emerald-400'
          : hcStatus === 'NotInstalled'
            ? 'border-amber-800 bg-amber-900/20 text-amber-400'
            : hcStatus === 'Checking...'
              ? 'border-zinc-700 bg-zinc-800/30 text-zinc-400'
              : 'border-red-800 bg-red-900/20 text-red-400'
      }`}>
        <span className="font-medium">Health Connect:</span>{' '}
        {hcStatus === 'Checking...' ? 'Checking availability...' :
         hcStatus === 'Available' ? 'Available' :
         hcStatus === 'NotInstalled' ? 'Not installed on this device' :
         hcStatus === 'Error' ? 'Error checking availability' :
         `Status: ${hcStatus}`}
      </div>

      {/* Permission Error */}
      {permError && (
        <div className="mb-4 rounded-xl border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          <span className="font-medium">Permission Error:</span>
          <pre className="mt-1 whitespace-pre-wrap font-mono text-xs text-red-300">{permError}</pre>
        </div>
      )}

      {/* Permissions button */}
      <div className="mb-6">
        <button
          type="button"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan"
          onClick={handleRequestPermissions}
        >
          {permGranted ? 'Re-request Health Connect Permissions' : 'Request Health Connect Permissions'}
        </button>
      </div>

      <div className="mb-6">
        <StepInjector onLog={appendLog} />
      </div>

      <div className="mb-6">
        <StepDeleter onLog={appendLog} />
      </div>

      <ActivityLog logs={logs} />
    </div>
  )
}
