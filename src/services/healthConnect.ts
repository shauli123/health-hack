import { HealthConnect } from 'capacitor-health-connect'
import { TIME_PRESET_MAP } from '../types/health'
import type { TimePreset } from '../types/health'

export async function requestWritePermissions(): Promise<boolean> {
  try {
    const result = await HealthConnect.requestHealthPermissions({
      read: ['Steps'],
      write: ['Steps'],
    })
    return result.hasAllPermissions
  } catch {
    return false
  }
}

export async function injectSteps(
  steps: number,
  timePreset: TimePreset,
): Promise<number> {
  const durationMs = TIME_PRESET_MAP[timePreset]
  const now = new Date()
  const interval = durationMs / steps

  const records = Array.from({ length: steps }, (_, i) => {
    const recordTime = new Date(now.getTime() - i * interval)
    return {
      type: 'Steps' as const,
      startTime: recordTime,
      endTime: recordTime,
      count: 1,
    }
  })

  const result = await HealthConnect.insertRecords({ records })
  return result?.recordIds?.length ?? 0
}

export function openHealthConnectSettings(): Promise<void> {
  return HealthConnect.openHealthConnectSetting()
}

export function isHealthConnectAvailable(): Promise<{ availability: string }> {
  return HealthConnect.checkAvailability()
}
