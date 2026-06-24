import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.healthhack.app',
  appName: 'HealthHack',
  webDir: 'dist',
  hooks: {
    afterSync: async () => {
      const { execSync } = await import('node:child_process')
      try {
        execSync('node scripts/patch-android-manifest.mjs', {
          stdio: 'inherit',
        })
      } catch {
        console.warn('[capacitor] Manifest patch skipped or failed')
      }
    },
  },
}

export default config
