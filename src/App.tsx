import { useState, useEffect, useCallback } from 'react'
import type { LogEntry } from './types/health'
import { isHealthConnectAvailable } from './services/healthConnect'
import { Header } from './components/Header'
import { StepInjector } from './components/StepInjector'
import { StepDeleter } from './components/StepDeleter'
import { ActivityLog } from './components/ActivityLog'

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [hcAvailable, setHcAvailable] = useState<boolean | null>(null)

  const appendLog = useCallback((entry: LogEntry) => {
    setLogs((prev) => [entry, ...prev])
  }, [])

  useEffect(() => {
    isHealthConnectAvailable()
      .then((res) => setHcAvailable(res.availability === 'Available'))
      .catch(() => setHcAvailable(false))
  }, [])

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <Header />

      {hcAvailable === false && (
        <div className="mb-6 rounded-xl border border-amber-800 bg-amber-900/20 px-5 py-3 text-sm text-amber-400">
          ⚠ Health Connect is not available on this device. The app requires
          Android with Health Connect installed.
        </div>
      )}

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
