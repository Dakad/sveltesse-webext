/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'
// import App from './views/App.svelte'

// The content script has direct access to the current web page.
// Put all the javascript code here, that you want to execute after page load.

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.debug('[sveltesse-webext] Yello World from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[sveltesse-webext] Navigate from page ""`)
  })

  // mount component to context window
  const container = document.createElement('div')
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/pages/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)


})()
