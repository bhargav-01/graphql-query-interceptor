# Debugging Guide - Hash Tracking Not Working

## Quick Fix Steps

### 1. Reload the Extension
```
1. Go to chrome://extensions/
2. Find "GraphQL Query Interceptor"
3. Click the reload icon (circular arrow)
4. This applies the latest code changes
```

### 2. Reload the Webpage
```
1. Go to your Sprinklr page (or GraphQL app)
2. Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. This does a hard reload and reloads the content script
```

### 3. Add Hash and Test

**Your hash from the curl:**
```
9803a0eb153d37a366334d8fb89f0e9499436aff721e88b404b0ec3decff2b9f
```

**Steps:**
1. Open the extension popup
2. Paste this hash: `9803a0eb153d37a366334d8fb89f0e9499436aff721e88b404b0ec3decff2b9f`
3. Click "Add"
4. Open DevTools (F12)
5. Go to Console tab
6. Trigger the query on the page (refresh creatives list or whatever triggers it)
7. Watch the console for messages

## What to Look For in Console

### Expected Console Messages (in order):

```javascript
// 1. When extension loads
[GraphQL Interceptor] Content script loaded
[GraphQL Interceptor] Injected script loaded from file
[GraphQL Interceptor] Fetch wrapper starting to install...
[GraphQL Interceptor] Fetch wrapper installed successfully!

// 2. When you add a hash
[GraphQL Interceptor] Performing initial update with hashes: ["9803a0eb..."]
[GraphQL Interceptor] Updating injected script with hashes: ["9803a0eb..."]
[GraphQL Interceptor] Updated tracked hashes: 1 hashes
[GraphQL Interceptor] Tracked hashes: ["9803a0eb..."]

// OR when updating existing hash
[GraphQL Interceptor] Received hash update from background: ["9803a0eb..."]
[GraphQL Interceptor] Updating injected script with hashes: ["9803a0eb..."]
[GraphQL Interceptor] Updated tracked hashes: 1 hashes
[GraphQL Interceptor] Tracked hashes: ["9803a0eb..."]

// 3. When query is triggered
[GraphQL Interceptor] Found GraphQL request with hash: 9803a0eb...
[GraphQL Interceptor] Is tracked? true
[GraphQL Interceptor] Invalidating hash: 9803a0eb...

// 4. When query retries with full query
[GraphQL Interceptor] Found GraphQL request with hash: 9803a0eb...
[GraphQL Interceptor] Is tracked? true
[GraphQL Interceptor] Captured query for hash: 9803a0eb...
```

## Troubleshooting by Console Messages

### Problem 1: Don't see "Content script loaded"
**Cause:** Extension not loaded or page loaded before extension
**Fix:**
1. Reload extension at chrome://extensions/
2. Reload the webpage with Cmd+Shift+R

### Problem 1.5: Don't see "Fetch wrapper installed successfully!"
**Cause:** Injected script failed to load (CSP issue or file missing)
**Fix:**
1. Check for "[GraphQL Interceptor] Failed to load injected script" error
2. Verify injected.js exists in extension folder
3. Reload extension at chrome://extensions/
4. Hard reload webpage: Cmd+Shift+R

### Problem 2: Don't see "Received hash update"
**Cause:** Communication between popup and content script broken
**Fix:**
1. Close and reopen the extension popup
2. Add the hash again
3. Check if you see the update message

### Problem 3: See "Is tracked? false"
**Cause:** Hash not in tracked list
**Fix:**
1. Check the hash you added is exactly the same (case-sensitive, 64 chars)
2. Look at "Tracked hashes:" console message to see what's tracked
3. Compare with "Found GraphQL request with hash:" message

### Problem 4: Don't see "Found GraphQL request"
**Cause:** Request not being intercepted by fetch wrapper
**Fix:**
1. Verify the request is using fetch (not XHR)
2. Check Network tab to see if request is actually being made
3. Make sure extension is enabled (green toggle in popup)

### Problem 5: See "Invalidating" but no "Captured"
**Cause:** Application not retrying with full query
**Fix:**
1. This is application-specific behavior
2. Some apps might handle the error differently
3. Check Network tab for a second request with the same operation
4. Look for error response from server

## Step-by-Step Debug Process

### Step 1: Verify Extension is Working
1. Open console on any page
2. You should see:
   ```
   [GraphQL Interceptor] Content script loaded
   [GraphQL Interceptor] Fetch wrapper installed
   ```
3. If not, reload extension and page

### Step 2: Verify Hash is Tracked
1. Add hash in popup
2. Check console for:
   ```
   [GraphQL Interceptor] Received hash update from background
   [GraphQL Interceptor] Tracked hashes: ["your-hash"]
   ```
3. If not, try closing and reopening popup, then add again

### Step 3: Verify Request is Found
1. Trigger the GraphQL query
2. Look for:
   ```
   [GraphQL Interceptor] Found GraphQL request with hash: ...
   [GraphQL Interceptor] Is tracked? true
   ```
3. If "Is tracked? false", your hash doesn't match

### Step 4: Verify Hash is Invalidated
1. After request found, should see:
   ```
   [GraphQL Interceptor] Invalidating hash: ...
   ```
2. Check Network tab - request should fail or return error
3. Application should retry

### Step 5: Verify Capture
1. After retry, should see:
   ```
   [GraphQL Interceptor] Captured query for hash: ...
   ```
2. Check extension popup - query should appear
3. If not, check if error happened in background script

## Common Issues

### Issue: "Fetch wrapper not installed"
**Solution:**
- Extension loaded after page
- Do hard reload: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Issue: Hash tracked but not invalidating
**Solution:**
- Hash might be slightly different (copy-paste error)
- Use console to compare exact hash values
- Try copying hash from Network tab Payload, not headers

### Issue: Application not retrying
**Solution:**
- Some apps don't follow standard persisted query pattern
- Check Network tab for error response
- App might cache the error and not retry
- Try triggering a different action

### Issue: Extension popup not updating
**Solution:**
- Popup auto-refreshes every 2 seconds
- Try closing and reopening popup
- Check browser console (not page console) for extension errors

## Testing with Your Specific Request

Based on your curl command, here's what should happen:

**1. Your GraphQL Endpoint:**
```
https://space-qa6-cfm-dev.sprinklr.com/ui/graphql/cfm/searchStandardEntities
```

**2. Your Hash:**
```
9803a0eb153d37a366334d8fb89f0e9499436aff721e88b404b0ec3decff2b9f
```

**3. Operation:**
```
searchStandardEntities
```

**4. What to do:**
```bash
# 1. Add hash to extension
9803a0eb153d37a366334d8fb89f0e9499436aff721e88b404b0ec3decff2b9f

# 2. Open console on Sprinklr page
# 3. Navigate to: /cfm-app/programs/creatives
# 4. Look for the console messages above
# 5. The query should be captured
```

## Advanced Debugging

### Check Background Script
1. Go to `chrome://extensions/`
2. Find "GraphQL Query Interceptor"
3. Click "service worker" or "background page"
4. This opens background script console
5. Look for errors there

### Check Storage
```javascript
// Run in page console
chrome.storage.local.get(null, (data) => console.log(data));
```

### Manual Test
```javascript
// Run in page console after adding hash
// This should show your hash in the list
window.postMessage({ type: 'GRAPHQL_INTERCEPTOR_UPDATE', hashes: ['9803a0eb153d37a366334d8fb89f0e9499436aff721e88b404b0ec3decff2b9f'] }, '*');
```

## Quick Checklist

Before asking for help, verify:

- [ ] Extension is loaded and enabled (green toggle)
- [ ] Page was reloaded AFTER adding hash
- [ ] Hash is exactly 64 characters
- [ ] Hash matches the one in Network tab
- [ ] Console shows "Content script loaded"
- [ ] Console shows "Fetch wrapper installed"
- [ ] Console shows hash in "Tracked hashes:" array
- [ ] Request is being made (visible in Network tab)
- [ ] Request has `extensions.persistedQuery.sha256Hash` in body

## Still Not Working?

If you've tried everything above:

1. **Copy all console messages** and share them
2. **Take screenshot** of extension popup showing the tracked hash
3. **Take screenshot** of Network tab showing the request payload
4. **Check if request uses fetch or XHR** (extension only works with fetch)
5. **Try with test-page.html** first to verify extension works

## Contact Info

If it's still not working after following this guide:
1. Gather console logs
2. Screenshot of Network tab payload
3. Screenshot of extension popup
4. Share these for debugging

---

**Most Common Fix:** Reload extension → Reload page → Add hash → Trigger query

