/**
 * Patches android/app/src/main/AndroidManifest.xml with required
 * Health Connect entries. Idempotent — safe to run multiple times.
 *
 * Injects:
 *  1. <queries> block for Health Connect package visibility (API 30+)
 *  2. SHOW_HEALTH_CONNECT_PRIVACY_POLICY intent-filter on MainActivity
 *  3. WRITE_STEPS / READ_STEPS <uses-permission> if absent
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const MANIFEST_PATH = resolve(
  __dirname,
  '..',
  'android',
  'app',
  'src',
  'main',
  'AndroidManifest.xml',
)

const HC_PACKAGE = 'com.google.android.apps.healthdata'

function readManifest(path) {
  return readFileSync(path, 'utf-8')
}

function writeManifest(path, content) {
  writeFileSync(path, content, 'utf-8')
  console.log(`✅ Patched: ${path}`)
}

function injectAfter(text, after, injection) {
  if (text.includes(injection)) return text // already present
  const idx = text.indexOf(after)
  if (idx === -1) {
    console.warn(`⚠  Pattern not found: "${after}" — appending to end`)
    return text + '\n' + injection
  }
  return text.slice(0, idx + after.length) + '\n' + injection + text.slice(idx + after.length)
}

function patch(path) {
  let xml = readManifest(path)

  // 1. <queries> block after opening <manifest> tag
  const queriesBlock = `    <queries>
        <package android:name="${HC_PACKAGE}" />
    </queries>`
  xml = injectAfter(xml, '<manifest xmlns:android="http://schemas.android.com/apk/res/android">', '\n\n' + queriesBlock)

  // 2. SHOW_HEALTH_CONNECT_PRIVACY_POLICY intent-filter on MainActivity
  const privacyFilter = `            <intent-filter>
                <action android:name="android.intent.action.SHOW_HEALTH_CONNECT_PRIVACY_POLICY" />
            </intent-filter>`
  // Insert right before the first closing </activity> tag
  const activityCloseIdx = xml.indexOf('</activity>')
  if (activityCloseIdx !== -1 && !xml.includes('SHOW_HEALTH_CONNECT_PRIVACY_POLICY')) {
    xml = xml.slice(0, activityCloseIdx) + '\n' + privacyFilter + '\n        ' + xml.slice(activityCloseIdx)
  }

  // 3. Permissions
  const permissions = [
    'android.permission.health.READ_STEPS',
    'android.permission.health.WRITE_STEPS',
  ]
  for (const perm of permissions) {
    const tag = `<uses-permission android:name="${perm}" />`
    if (!xml.includes(perm)) {
      xml += `\n    ${tag}`
    }
  }

  writeManifest(path, xml)
}

try {
  patch(MANIFEST_PATH)
} catch (err) {
  console.error('❌ Failed to patch AndroidManifest.xml:', err.message)
  process.exit(1)
}
