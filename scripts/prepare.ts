// generate stub index.html files for dev entry
import { execSync } from 'child_process'
import fs from 'fs-extra'
import chokidar from 'chokidar'
import { isDev, log, port, r } from './utils'

/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml() {
  const pages = [
    'options',
    'popup',
    'background',
  ]

  for (const view of pages) {
    await fs.ensureDir(r(`extension/dist/pages/${view}`))
    let data = await fs.readFile(r(`src/pages/${view}/index.html`), 'utf-8')
    data = data.replace('"./main.ts"', `"http://localhost:${port}/pages/${view}/main.ts"`)
    await fs.writeFile(r(`extension/dist/pages/${view}/index.html`), data, 'utf-8')
    log('PRE', `stub pages/${view}`)
  }
}

async function copyAssetsforManifest() {
  await fs.emptyDir(r('extension/assets'))
  await fs.copy(r('src/assets'), r('extension/assets'))
  log('PRE', `Copy src/assets to extension/assets`)
}

function writeManifest() {
  execSync('pnpm esno ./scripts/manifest.json.ts', { stdio: 'inherit' })
}

writeManifest()
copyAssetsforManifest()

if (isDev) {
  stubIndexHtml()

  chokidar.watch(r('src/**/*.html'))
    .on('change', stubIndexHtml)
  log('PRE', 'Watching change src/**/*.html')

  chokidar.watch([r('scripts/manifest.json.ts'), r('package.json')])
    .on('change', () => writeManifest())
  log('PRE', 'Watching change on src/manifest.jon.ts and packagee.json')
}
