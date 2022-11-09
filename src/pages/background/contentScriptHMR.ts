import { isFirefox, isForbiddenUrl } from '~/env'

// Firefox fetch files from cache instead of reloading changes from disk,
// hmr will not work as Chromium based browser
browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
  // Filter out non main window events.
  if (frameId !== 0)
    return

  if (isForbiddenUrl(url))
    return

  // inject the latest scripts
  browser.tabs.executeScript(tabId, {
    file: `${isFirefox ? '' : '.'}/dist/pages/contentScripts/index.global.js`,
    runAt: 'document_end',
  })
    .then(_ => console.debug('[contentScriptHMR] pages/contentScripts dynamically loaded!'))
    .catch(error => console.error(`[contentScriptHMR] ${error}`))
})
