// Content Script for GraphQL Query Interceptor
// This script intercepts fetch calls and modifies requests with tracked hashes

(function() {
  'use strict';

  let trackedHashes = [];
  let interceptEnabled = true;
  const invalidatedHashes = new Set();

  // Load initial state from background
  chrome.runtime.sendMessage({ action: 'getTrackedHashes' }, (response) => {
    if (response && response.hashes) {
      trackedHashes = response.hashes;
    }
  });

  chrome.runtime.sendMessage({ action: 'getEnabled' }, (response) => {
    if (response && response.enabled !== undefined) {
      interceptEnabled = response.enabled;
    }
  });

  // Inject the fetch interceptor into the page
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  script.onload = function() {
    console.log('[GraphQL Interceptor] Injected script loaded from file');
    this.remove();
    // Send initial hashes after script loads
    setTimeout(() => {
      console.log('[GraphQL Interceptor] Performing initial update with hashes:', trackedHashes);
      updateInjectedScript();
    }, 100);
  };
  script.onerror = function() {
    console.error('[GraphQL Interceptor] Failed to load injected script');
  };
  
  // Inject the script before any other scripts run
  (document.head || document.documentElement).appendChild(script);

  // Send tracked hashes to the injected script
  function updateInjectedScript() {
    console.log('[GraphQL Interceptor] Updating injected script with hashes:', trackedHashes);
    window.postMessage({
      type: 'GRAPHQL_INTERCEPTOR_UPDATE',
      hashes: trackedHashes
    }, '*');
    
    // Set enabled/disabled flag
    if (interceptEnabled) {
      delete window.GRAPHQL_INTERCEPTOR_DISABLED;
    } else {
      window.GRAPHQL_INTERCEPTOR_DISABLED = true;
    }
  }

  // Listen for messages from the injected script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'GRAPHQL_INTERCEPTOR_CAPTURED') {
      // Send captured query to background
      chrome.runtime.sendMessage({
        action: 'captureQuery',
        data: event.data.data
      });
    }
  });

  // Listen for updates from background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateTrackedHashes') {
      trackedHashes = request.hashes || [];
      interceptEnabled = request.enabled !== false;
      console.log('[GraphQL Interceptor] Received hash update from background:', trackedHashes);
      updateInjectedScript();
      sendResponse({ success: true });
    }
    return true;
  });

  console.log('[GraphQL Interceptor] Content script loaded');
})();

