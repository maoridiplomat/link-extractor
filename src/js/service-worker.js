// Background Service Worker JS

import { createContextMenus, injectTab } from './exports.js'

chrome.runtime.onInstalled.addListener(onInstalled)

chrome.contextMenus.onClicked.addListener(async function (ctx) {
    console.log('ctx:', ctx)
    if (ctx.menuItemId === 'links') {
        await injectTab(null, null)
    } else if (ctx.menuItemId === 'domains') {
        await injectTab(null, true)
    } else if (ctx.menuItemId.startsWith('filter-')) {
        const { patterns } = await chrome.storage.sync.get(['patterns'])
        const i = ctx.menuItemId.split('-')[1]
        console.log(`i: ${i}`)
        console.log(`filter: ${patterns[i]}`)
        await injectTab(patterns[i], true)
    } else {
        console.error(`Unknown ctx.menuItemId: ${ctx.menuItemId}`)
    }
})

// chrome.storage.onChanged.addListener((changes, namespace) => {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//         console.log(
//             `Storage key "${key}" in namespace "${namespace}" changed. Old/New:`,
//             oldValue,
//             newValue
//         )
//     }
// })

/**
 * Init Context Menus and Options
 * @function onInstalled
 */
export async function onInstalled() {
    console.log('onInstalled')
    let { options, patterns } = await chrome.storage.sync.get([
        'options',
        'patterns',
    ])
    options = options || { flags: 'ig', contextMenu: true }
    patterns = patterns || []
    await chrome.storage.sync.set({ options, patterns })
    if (options.contextMenu) {
        createContextMenus(patterns)
    }
}
