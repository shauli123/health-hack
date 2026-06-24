import { HealthConnect } from 'capacitor-health-connect'
import { TIME_PRESET_MAP } from '../types/health'
import type { TimePreset } from '../types/health'

export interface PermissionResult {
  granted: boolean
  error?: string
}

export interface AvailabilityResult {
  status: string
  raw?: string
}

export async function requestWritePermissions(): Promise<PermissionResult> {
  try {
    const result = await HealthConnect.requestHealthPermissions({
      read: ['Steps'],
      write: ['Steps'],
    })
    return { granted: result.hasAllPermissions }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { granted: false, error: msg }
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

export async function checkAvailability(): Promise<AvailabilityResult> {
  try {
    const res = await HealthConnect.checkAvailability()
    return { status: res.availability, raw: res.availability }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { status: 'Error', raw: msg }
  }
}
