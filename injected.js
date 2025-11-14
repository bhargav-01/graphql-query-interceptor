// Injected Script - Runs in page context to intercept fetch
(function() {
  'use strict';
  
  const originalFetch = window.fetch;
  const blocked = new Set();
  
  console.log('[GraphQL Interceptor] Fetch wrapper starting to install...');
  
  // Listen for messages from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'GRAPHQL_INTERCEPTOR_UPDATE') {
      // Update blocked hashes
      blocked.clear();
      (event.data.hashes || []).forEach(hash => blocked.add(hash));
      console.log('[GraphQL Interceptor] Updated tracked hashes:', event.data.hashes.length, 'hashes');
      console.log('[GraphQL Interceptor] Tracked hashes:', Array.from(blocked));
    }
  });

  // Override fetch method
  window.fetch = async function(url, options = {}) {
    // Check if interception is enabled
    const interceptEnabled = !window.GRAPHQL_INTERCEPTOR_DISABLED;
    
    if (interceptEnabled && options && options.body) {
      const bodyAsJson = tryParseJson(options.body);
      
      // Check if this is a GraphQL request with persisted query
      if (bodyAsJson?.extensions?.persistedQuery?.sha256Hash) {
        const sha = bodyAsJson.extensions.persistedQuery.sha256Hash;
        console.log('[GraphQL Interceptor] Found GraphQL request with hash:', sha);
        console.log('[GraphQL Interceptor] Is tracked?', blocked.has(sha));
        
        // If this hash is tracked and not yet invalidated
        if (blocked.has(sha) && !bodyAsJson.query) {
          console.log('[GraphQL Interceptor] Invalidating hash:', sha);
          
          // Modify the hash to trigger full query
          bodyAsJson.extensions.persistedQuery.sha256Hash = '1';
          options.body = JSON.stringify(bodyAsJson);
          
          // Mark as invalidated
          window.postMessage({
            type: 'GRAPHQL_INTERCEPTOR_INVALIDATED',
            hash: sha
          }, '*');
        }
        
        // Check if this is the retry with full query
        if (bodyAsJson.query && blocked.has(sha)) {
          console.log('[GraphQL Interceptor] Captured query for hash:', sha);
          
          // Send the captured query
          window.postMessage({
            type: 'GRAPHQL_INTERCEPTOR_CAPTURED',
            data: {
              hash: sha,
              query: bodyAsJson.query,
              operationName: bodyAsJson.operationName,
              variables: bodyAsJson.variables,
              url: url
            }
          }, '*');
        }
      }
    }

    // Call original fetch
    return originalFetch(url, options);
  };

  // Helper function to parse JSON safely
  function tryParseJson(body) {
    try {
      return JSON.parse(body);
    } catch (e) {
      return null;
    }
  }

  console.log('[GraphQL Interceptor] Fetch wrapper installed successfully!');
})();

