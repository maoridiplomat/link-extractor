// JS Exports

/**
 * Create Context Menus
 * @function createContextMenus
 * @param {Array} patterns
 */
export function createContextMenus(patterns) {
    const contexts = [
        // ['link', 'link', 'Copy Text to Clipboard'],
        ['page', 'filters', 'Extract with Filter'],
        ['page', 'links', 'Extract All Links'],
        ['page', 'domains', 'Extract All Domains'],
    ]
    for (const context of contexts) {
        chrome.contextMenus.create({
            title: context[2],
            contexts: [context[0]],
            id: context[1],
        })
    }
    // const { patterns } = await chrome.storage.sync.get(['patterns'])
    // console.log('patterns', patterns)
    if (patterns) {
        patterns.forEach((pattern, i) => {
            // console.log(`pattern: ${i}: ${pattern}`)
            chrome.contextMenus.create({
                parentId: 'filters',
                title: pattern.substring(0, 24),
                contexts: ['page'],
                id: `filter-${i}`,
            })
        })
    }
}

/**
 * Inject inject.js to Tab and Open links.html
 * @function processLinks
 * @param {String} filter
 * @param {Boolean} domains
 */
export async function injectTab(filter, domains) {
    const url = new URL(chrome.runtime.getURL('../html/links.html'))
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    console.log(`tab.id: ${tab.id}`)
    url.searchParams.set('tab', tab.id.toString())
    if (filter) {
        url.searchParams.set('filter', filter)
    } else if (domains) {
        url.searchParams.set('domains', 'yes')
    }
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['/js/inject.js'],
    })
    console.log(`url: ${url.toString()}`)
    await chrome.tabs.create({ active: true, url: url.toString() })
}
