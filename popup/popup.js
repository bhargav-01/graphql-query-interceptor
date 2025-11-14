// Popup UI Logic for GraphQL Query Interceptor

// DOM Elements
const hashInput = document.getElementById('hashInput');
const addHashBtn = document.getElementById('addHashBtn');
const inputError = document.getElementById('inputError');
const enableToggle = document.getElementById('enableToggle');
const statusText = document.getElementById('statusText');
const clearHashesBtn = document.getElementById('clearHashesBtn');
const clearQueriesBtn = document.getElementById('clearQueriesBtn');
const trackedHashesList = document.getElementById('trackedHashesList');
const capturedQueriesList = document.getElementById('capturedQueriesList');
const hashCount = document.getElementById('hashCount');
const queryCount = document.getElementById('queryCount');

// State
let trackedHashes = [];
let capturedQueries = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  setupEventListeners();
  renderAll();
});

// Load state from background
async function loadState() {
  // Get enabled status
  const enabledResponse = await sendMessage({ action: 'getEnabled' });
  if (enabledResponse && enabledResponse.enabled !== undefined) {
    enableToggle.checked = enabledResponse.enabled;
    updateStatusText(enabledResponse.enabled);
  }

  // Get tracked hashes
  const hashesResponse = await sendMessage({ action: 'getTrackedHashes' });
  if (hashesResponse && hashesResponse.hashes) {
    trackedHashes = hashesResponse.hashes;
  }

  // Get captured queries
  const queriesResponse = await sendMessage({ action: 'getCapturedQueries' });
  if (queriesResponse && queriesResponse.queries) {
    capturedQueries = queriesResponse.queries;
  }
}

// Setup event listeners
function setupEventListeners() {
  addHashBtn.addEventListener('click', handleAddHash);
  hashInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleAddHash();
    }
  });
  hashInput.addEventListener('input', () => {
    inputError.classList.remove('show');
  });
  
  enableToggle.addEventListener('change', handleToggleEnabled);
  clearHashesBtn.addEventListener('click', handleClearHashes);
  clearQueriesBtn.addEventListener('click', handleClearQueries);

  // Listen for storage changes and update UI only when data changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      let shouldUpdate = false;
      
      if (changes.trackedHashes) {
        trackedHashes = changes.trackedHashes.newValue || [];
        shouldUpdate = true;
      }
      
      if (changes.capturedQueries) {
        capturedQueries = changes.capturedQueries.newValue || [];
        shouldUpdate = true;
      }
      
      if (changes.interceptEnabled) {
        enableToggle.checked = changes.interceptEnabled.newValue !== false;
        updateStatusText(changes.interceptEnabled.newValue !== false);
        shouldUpdate = true;
      }
      
      if (shouldUpdate) {
        renderAll();
      }
    }
  });
}

// Handle add hash
async function handleAddHash() {
  const hash = hashInput.value.trim();
  
  // Validate hash
  if (!hash) {
    showError('Please enter a hash');
    return;
  }

  if (!isValidHash(hash)) {
    showError('Invalid hash format. Must be a 64-character hexadecimal string.');
    return;
  }

  if (trackedHashes.includes(hash)) {
    showError('This hash is already being tracked');
    return;
  }

  // Add hash
  const response = await sendMessage({ action: 'addHash', hash });
  if (response && response.success) {
    hashInput.value = '';
    await loadState();
    renderAll();
    showSuccess('Hash added successfully!');
  } else {
    showError('Failed to add hash');
  }
}

// Validate hash format (sha256 = 64 hex characters)
function isValidHash(hash) {
  return /^[a-fA-F0-9]{64}$/.test(hash);
}

// Handle remove hash
async function handleRemoveHash(hash) {
  const response = await sendMessage({ action: 'removeHash', hash });
  if (response && response.success) {
    await loadState();
    renderAll();
  }
}

// Handle toggle enabled
async function handleToggleEnabled() {
  const enabled = enableToggle.checked;
  await sendMessage({ action: 'setEnabled', enabled });
  updateStatusText(enabled);
}

// Handle clear all hashes
async function handleClearHashes() {
  if (confirm('Are you sure you want to clear all tracked hashes?')) {
    await sendMessage({ action: 'clearHashes' });
    await loadState();
    renderAll();
  }
}

// Handle clear all queries
async function handleClearQueries() {
  if (confirm('Are you sure you want to clear all captured queries?')) {
    await sendMessage({ action: 'clearQueries' });
    await loadState();
    renderAll();
  }
}

// Render all sections
function renderAll() {
  renderTrackedHashes();
  renderCapturedQueries();
  updateCounts();
}

// Render tracked hashes
function renderTrackedHashes() {
  if (trackedHashes.length === 0) {
    trackedHashesList.innerHTML = '<p class="empty-state">No hashes tracked yet. Add a hash above to get started.</p>';
    return;
  }

  trackedHashesList.innerHTML = trackedHashes.map(hash => {
    const query = capturedQueries.find(q => q.hash === hash);
    const status = query && query.status === 'captured' ? 'captured' : 'pending';
    
    return `
      <div class="hash-item ${status}">
        <div class="hash-info">
          <div class="hash-value" title="${hash}">${hash}</div>
          <span class="hash-status ${status}">${status === 'captured' ? '✓ Captured' : '⏳ Pending'}</span>
        </div>
        <div class="hash-actions">
          <button class="btn btn-danger btn-sm" data-hash="${hash}" data-action="remove">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  // Add event listeners
  trackedHashesList.querySelectorAll('[data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const hash = e.target.dataset.hash;
      handleRemoveHash(hash);
    });
  });
}

// Render captured queries
function renderCapturedQueries() {
  const captured = capturedQueries.filter(q => q.status === 'captured' && q.query);
  
  if (captured.length === 0) {
    capturedQueriesList.innerHTML = '<p class="empty-state">No queries captured yet. Trigger the tracked queries on the webpage.</p>';
    return;
  }

  capturedQueriesList.innerHTML = captured.map((query, index) => {
    const operationName = query.operationName || 'Unnamed Query';
    const timestamp = query.capturedAt ? new Date(query.capturedAt).toLocaleString() : '';
    const hasVariables = query.variables && Object.keys(query.variables).length > 0;
    
    return `
      <div class="query-item">
        <div class="query-header">
          <div class="query-meta">
            <div class="query-name">${escapeHtml(operationName)}</div>
            <div class="query-hash" title="${query.hash}">Hash: ${query.hash.substring(0, 16)}...</div>
            ${timestamp ? `<div class="query-time">${timestamp}</div>` : ''}
          </div>
          <div class="query-actions">
            <button class="btn btn-copy btn-sm" data-index="${index}" data-action="copy">Copy</button>
          </div>
        </div>
        <div class="query-content" id="query-${index}">${formatGraphQL(query.query)}</div>
        ${hasVariables ? `
          <div class="query-variables">
            <div class="query-variables-title">Variables:</div>
            <div class="query-variables-content">${JSON.stringify(query.variables, null, 2)}</div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Add event listeners for copy buttons
  capturedQueriesList.querySelectorAll('[data-action="copy"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      copyToClipboard(captured[index].query, e.target);
    });
  });
}

// Update counts
function updateCounts() {
  hashCount.textContent = trackedHashes.length;
  const capturedCount = capturedQueries.filter(q => q.status === 'captured' && q.query).length;
  queryCount.textContent = capturedCount;
}

// Update status text
function updateStatusText(enabled) {
  statusText.textContent = enabled ? 'Active' : 'Inactive';
  statusText.style.color = enabled ? '#4caf50' : '#ef5350';
}

// Show error message
function showError(message) {
  inputError.textContent = message;
  inputError.classList.add('show');
  setTimeout(() => {
    inputError.classList.remove('show');
  }, 3000);
}

// Show success message (temporary)
function showSuccess(message) {
  const successEl = document.createElement('div');
  successEl.className = 'success-notification';
  successEl.textContent = message;
  document.body.appendChild(successEl);
  
  setTimeout(() => {
    successEl.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => successEl.remove(), 300);
  }, 2500);
}

// Copy to clipboard
async function copyToClipboard(text, buttonElement) {
  try {
    await navigator.clipboard.writeText(text);
    
    // Visual feedback
    const originalText = buttonElement.textContent;
    buttonElement.textContent = 'Copied!';
    buttonElement.classList.add('copied');
    
    setTimeout(() => {
      buttonElement.textContent = originalText;
      buttonElement.classList.remove('copied');
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
    showError('Failed to copy to clipboard');
  }
}

// Format GraphQL query with syntax highlighting
function formatGraphQL(query) {
  if (!query) return '';
  
  // Basic formatting - add indentation
  let formatted = query.trim();
  let indent = 0;
  let result = '';
  
  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i];
    const nextChar = formatted[i + 1];
    
    if (char === '{') {
      result += char;
      if (nextChar !== '}') {
        indent++;
        result += '\n' + '  '.repeat(indent);
      }
    } else if (char === '}') {
      if (formatted[i - 1] !== '{') {
        indent--;
        result += '\n' + '  '.repeat(indent);
      }
      result += char;
    } else if (char === '\n') {
      result += '\n' + '  '.repeat(indent);
      // Skip whitespace after newline
      while (formatted[i + 1] === ' ' || formatted[i + 1] === '\t') {
        i++;
      }
    } else {
      result += char;
    }
  }
  
  // Apply syntax highlighting
  return highlightGraphQL(result);
}

// Syntax highlighting for GraphQL
function highlightGraphQL(query) {
  if (!query) return '';
  
  // Escape HTML first
  let highlighted = escapeHtml(query);
  
  // Highlight GraphQL keywords
  const keywords = ['query', 'mutation', 'subscription', 'fragment', 'on', 'true', 'false', 'null', 'type', 'interface', 'enum', 'input', 'extend', 'implements'];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    highlighted = highlighted.replace(regex, '<span class="gql-keyword">$1</span>');
  });
  
  // Highlight types (capitalized words, often after ':')
  highlighted = highlighted.replace(/:\s*([A-Z][a-zA-Z0-9]*)/g, ': <span class="gql-type">$1</span>');
  highlighted = highlighted.replace(/\b([A-Z][a-zA-Z0-9]*)\s*\(/g, '<span class="gql-type">$1</span>(');
  
  // Highlight strings
  highlighted = highlighted.replace(/&quot;([^&]*)&quot;/g, '<span class="gql-string">&quot;$1&quot;</span>');
  highlighted = highlighted.replace(/&#39;([^&]*)&#39;/g, '<span class="gql-string">&#39;$1&#39;</span>');
  
  // Highlight comments
  highlighted = highlighted.replace(/#(.*)$/gm, '<span class="gql-comment">#$1</span>');
  
  // Highlight field names (words followed by ':' or arguments)
  highlighted = highlighted.replace(/\b([a-z][a-zA-Z0-9_]*)\s*:/g, '<span class="gql-field">$1</span>:');
  highlighted = highlighted.replace(/\b([a-z][a-zA-Z0-9_]*)\s*\(/g, '<span class="gql-field">$1</span>(');
  
  return highlighted;
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Send message to background script
function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Message error:', chrome.runtime.lastError);
        resolve(null);
      } else {
        resolve(response);
      }
    });
  });
}

