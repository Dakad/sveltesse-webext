import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, log, port, r } from './utils'

export async function writeManifest() {
  await fs.writeJSON(r('extension/manifest.json'), await getManifest(), { spaces: 2 })
  log('PRE', 'write manifest.json')
}

writeManifest()

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: './assets/icon.png',
      default_popup: './dist/pages/popup/index.html',
    },
    options_ui: {
      page: './dist/pages/options/index.html',
      open_in_tab: true,
      browser_style: false,
      // For Google Chrome and Opera
      chrome_style: false,
    },
    // Background scripts are the place to put code that needs to maintain long-term state,
    // or perform long-term operations, independently of the lifetime of any particular
    // web pages or browser windows.
    background: {
      page: './dist/pages/background/index.html',
      // If **false**, it will behave like Event Pages and indicates the background page
      // may be unloaded from memory when idle and recreated when needed. Registration
      // of listeners is persistent when the page is unloaded from memory,
      // but other values are not persistent
      persistent: false,
    },
    icons: {
      16: './assets/icon.png',
      48: './assets/icon.png',
      128: './assets/icon.png',
    },
    permissions: [
      'storage',
      'activeTab',
      'http://*/',
      'https://*/',
    ],
    // content_scripts: [{
    //   matches: ['http://*/*', 'https://*/*'],
    //   js: ['./dist/pages/contentScripts/index.global.js'],
    // }],
    web_accessible_resources: [
      'dist/pages/contentScripts/style.css',
      'dist/pages/contentScripts/index.global.js',
    ],
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/pages/background/contentScriptHMR.ts
    // delete manifest.content_scripts

    manifest.permissions?.push('webNavigation')

    // this is required on dev for Vite script to load
    manifest.content_security_policy = `script-src \'self\' http://localhost:${port}; object-src \'self\'`
  }

  return manifest
}
