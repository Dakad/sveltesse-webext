/* eslint-disable no-console */
import 'uno.css'
import { onMessage } from 'webext-bridge'
import App from './views/App.svelte'

// The content script has direct access to the current web page.
// Put all the javascript code here, that you want to execute after page load.

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.debug('[sveltesse-webext] Yello World from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[sveltesse-webext] Navigate from page "${data}"`)
  })

  // mount component to context window
  const styleEl = document.createElement('link')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/pages/contentScripts/style.css'))

  const container = document.createElement('div')
  container.classList.add('_sveltesse__container')
  document.getElementsByTagName('head')[0].appendChild(styleEl)
  document.body.appendChild(container)

  /* eslint-disable no-new */
  new App({ target: container })
})()
