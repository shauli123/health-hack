export interface LogEntry {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  timestamp: Date
}

export type TimePreset = '15min' | '1hour' | '4hours'

export const TIME_PRESET_MAP: Record<TimePreset, number> = {
  '15min': 15 * 60 * 1000,
  '1hour': 60 * 60 * 1000,
  '4hours': 4 * 60 * 60 * 1000,
}
