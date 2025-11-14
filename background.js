// Background Service Worker for GraphQL Query Interceptor

// Storage keys
const STORAGE_KEYS = {
  TRACKED_HASHES: 'trackedHashes',
  CAPTURED_QUERIES: 'capturedQueries',
  ENABLED: 'interceptEnabled'
};

// Initialize storage
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get([
    STORAGE_KEYS.TRACKED_HASHES,
    STORAGE_KEYS.CAPTURED_QUERIES,
    STORAGE_KEYS.ENABLED
  ]);

  if (!data[STORAGE_KEYS.TRACKED_HASHES]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.TRACKED_HASHES]: [] });
  }
  if (!data[STORAGE_KEYS.CAPTURED_QUERIES]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.CAPTURED_QUERIES]: [] });
  }
  if (data[STORAGE_KEYS.ENABLED] === undefined) {
    await chrome.storage.local.set({ [STORAGE_KEYS.ENABLED]: true });
  }

  console.log('GraphQL Query Interceptor installed');
});

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case 'addHash':
          await addHash(request.hash);
          sendResponse({ success: true });
          break;

        case 'removeHash':
          await removeHash(request.hash);
          sendResponse({ success: true });
          break;

        case 'getTrackedHashes':
          const hashes = await getTrackedHashes();
          sendResponse({ hashes });
          break;

        case 'getCapturedQueries':
          const queries = await getCapturedQueries();
          sendResponse({ queries });
          break;

        case 'clearQueries':
          await clearQueries();
          sendResponse({ success: true });
          break;

        case 'clearHashes':
          await clearHashes();
          sendResponse({ success: true });
          break;

        case 'setEnabled':
          await setEnabled(request.enabled);
          sendResponse({ success: true });
          break;

        case 'getEnabled':
          const enabled = await getEnabled();
          sendResponse({ enabled });
          break;

        case 'captureQuery':
          await captureQuery(request.data);
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background error:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();
  
  return true; // Keep message channel open for async response
});

// Storage helper functions
async function addHash(hash) {
  const data = await chrome.storage.local.get(STORAGE_KEYS.TRACKED_HASHES);
  const hashes = data[STORAGE_KEYS.TRACKED_HASHES] || [];
  
  if (!hashes.includes(hash)) {
    hashes.push(hash);
    await chrome.storage.local.set({ [STORAGE_KEYS.TRACKED_HASHES]: hashes });
    
    // Initialize query entry with pending status
    const queries = await getCapturedQueries();
    const existing = queries.find(q => q.hash === hash);
    if (!existing) {
      queries.push({
        hash,
        status: 'pending',
        timestamp: Date.now()
      });
      await chrome.storage.local.set({ [STORAGE_KEYS.CAPTURED_QUERIES]: queries });
    }
    
    // Notify all content scripts
    notifyContentScripts();
  }
}

async function removeHash(hash) {
  const data = await chrome.storage.local.get(STORAGE_KEYS.TRACKED_HASHES);
  const hashes = data[STORAGE_KEYS.TRACKED_HASHES] || [];
  const filtered = hashes.filter(h => h !== hash);
  await chrome.storage.local.set({ [STORAGE_KEYS.TRACKED_HASHES]: filtered });
  
  // Notify all content scripts
  notifyContentScripts();
}

async function getTrackedHashes() {
  const data = await chrome.storage.local.get(STORAGE_KEYS.TRACKED_HASHES);
  return data[STORAGE_KEYS.TRACKED_HASHES] || [];
}

async function getCapturedQueries() {
  const data = await chrome.storage.local.get(STORAGE_KEYS.CAPTURED_QUERIES);
  return data[STORAGE_KEYS.CAPTURED_QUERIES] || [];
}

async function clearQueries() {
  await chrome.storage.local.set({ [STORAGE_KEYS.CAPTURED_QUERIES]: [] });
}

async function clearHashes() {
  await chrome.storage.local.set({ [STORAGE_KEYS.TRACKED_HASHES]: [] });
  await clearQueries();
  
  // Notify all content scripts
  notifyContentScripts();
}

async function setEnabled(enabled) {
  await chrome.storage.local.set({ [STORAGE_KEYS.ENABLED]: enabled });
  
  // Notify all content scripts
  notifyContentScripts();
}

async function getEnabled() {
  const data = await chrome.storage.local.get(STORAGE_KEYS.ENABLED);
  return data[STORAGE_KEYS.ENABLED] !== false; // Default to true
}

async function captureQuery(queryData) {
  const queries = await getCapturedQueries();
  const index = queries.findIndex(q => q.hash === queryData.hash);
  
  if (index !== -1) {
    // Update existing entry
    queries[index] = {
      ...queries[index],
      ...queryData,
      status: 'captured',
      capturedAt: Date.now()
    };
  } else {
    // Add new entry
    queries.push({
      ...queryData,
      status: 'captured',
      capturedAt: Date.now()
    });
  }
  
  // Limit to 50 most recent queries
  if (queries.length > 50) {
    queries.sort((a, b) => (b.capturedAt || b.timestamp) - (a.capturedAt || a.timestamp));
    queries.splice(50);
  }
  
  await chrome.storage.local.set({ [STORAGE_KEYS.CAPTURED_QUERIES]: queries });
}

// Notify all content scripts of changes
async function notifyContentScripts() {
  const tabs = await chrome.tabs.query({});
  const hashes = await getTrackedHashes();
  const enabled = await getEnabled();
  
  for (const tab of tabs) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'updateTrackedHashes',
        hashes,
        enabled
      });
    } catch (error) {
      // Tab might not have content script loaded yet
    }
  }
}

