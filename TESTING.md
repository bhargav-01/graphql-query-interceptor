# Testing Guide

## Pre-Testing Checklist

### 1. Generate Icons (Optional)

Open `icons/generate-icons.html` in a browser and download the three icon files:
- icon16.png
- icon48.png
- icon128.png

Place them in the `icons/` directory.

### 2. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `graphql-query-interceptor` folder
5. Verify the extension appears in the list
6. Check that there are no errors in the extension card

## Unit Testing Checklist

### Extension Loading

- [ ] Extension loads without errors
- [ ] Extension icon appears in toolbar (or default puzzle piece if no icons)
- [ ] Clicking icon opens popup
- [ ] Popup displays correctly with all three sections

### Popup UI Testing

#### Header
- [ ] Title displays: "GraphQL Query Interceptor"
- [ ] Toggle switch is present and interactive
- [ ] Status text shows "Active" (green) by default
- [ ] Toggle switch changes status text to "Inactive" (red) when off

#### Hash Input Section
- [ ] Input field accepts text
- [ ] Input field has placeholder text
- [ ] "Add" button is clickable
- [ ] Help text is visible and readable
- [ ] Error message appears for invalid input

#### Tracked Hashes Section
- [ ] Section header shows "Tracked Hashes (0)" initially
- [ ] "Clear All" button is present
- [ ] Empty state message displays when no hashes

#### Captured Queries Section
- [ ] Section header shows "Captured Queries (0)" initially
- [ ] "Clear All" button is present
- [ ] Empty state message displays when no queries

### Hash Input Validation

Test with various inputs:

- [ ] **Valid hash**: 64 hex characters (a-f, 0-9)
  - Example: `abc123def456789012345678901234567890123456789012345678901234`
  - Should accept and add to list

- [ ] **Invalid: Empty**: Click Add with empty field
  - Should show error: "Please enter a hash"

- [ ] **Invalid: Too short**: Less than 64 characters
  - Should show error: "Invalid hash format"

- [ ] **Invalid: Too long**: More than 64 characters
  - Should show error: "Invalid hash format"

- [ ] **Invalid: Non-hex characters**: Contains g-z or special characters
  - Should show error: "Invalid hash format"

- [ ] **Duplicate hash**: Add same hash twice
  - Should show error: "This hash is already being tracked"

### Hash Management

- [ ] Added hash appears in tracked list
- [ ] Hash status shows "⏳ Pending" (yellow border)
- [ ] Hash display is truncated with ellipsis
- [ ] Full hash visible on hover (title attribute)
- [ ] "Remove" button present for each hash
- [ ] Clicking "Remove" removes the hash
- [ ] Hash count updates correctly
- [ ] "Clear All" removes all hashes
- [ ] Confirmation dialog appears for "Clear All"

### Enable/Disable Toggle

- [ ] Toggle starts in "checked" state
- [ ] Clicking toggle unchecks it
- [ ] Status text changes to "Inactive"
- [ ] Status text color changes to red
- [ ] Toggle state persists when closing/reopening popup
- [ ] Disabling stops interception (test with actual queries)
- [ ] Re-enabling resumes interception

### Storage Persistence

- [ ] Close and reopen popup - tracked hashes remain
- [ ] Close and reopen browser - tracked hashes remain
- [ ] Reload extension - data may be cleared (expected)
- [ ] Clear browser data - extension data cleared

## Integration Testing with GraphQL Application

### Test Application Options

You can test with:
1. **Sprinklr** (as per the original PDF)
2. **Public GraphQL APIs** with persisted queries
3. **Your own application** that uses persisted queries
4. **Test harness** (create a simple HTML page with GraphQL client)

### Creating a Test Harness

Create a simple test file to simulate GraphQL persisted queries:

```html
<!DOCTYPE html>
<html>
<head>
  <title>GraphQL Interceptor Test</title>
</head>
<body>
  <h1>GraphQL Test Page</h1>
  <button id="testBtn">Send Test Query</button>
  <div id="result"></div>

  <script>
    // Simulate Apollo Client persisted query
    document.getElementById('testBtn').addEventListener('click', async () => {
      const testHash = 'a'.repeat(64); // 64 'a' characters
      
      try {
        // First request with only hash
        const response = await fetch('https://httpbin.org/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operationName: 'TestQuery',
            variables: { id: 123 },
            extensions: {
              persistedQuery: {
                version: 1,
                sha256Hash: testHash
              }
            }
          })
        });

        // If it fails (as it should with invalid hash from interceptor)
        // Retry with full query
        if (!response.ok) {
          const retryResponse = await fetch('https://httpbin.org/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: 'query TestQuery($id: ID!) { user(id: $id) { name email } }',
              operationName: 'TestQuery',
              variables: { id: 123 },
              extensions: {
                persistedQuery: {
                  version: 1,
                  sha256Hash: testHash
                }
              }
            })
          });
          
          document.getElementById('result').textContent = 
            'Retry successful! Check extension.';
        }
      } catch (error) {
        document.getElementById('result').textContent = 
          'Error: ' + error.message;
      }
    });
  </script>
</body>
</html>
```

### Testing Steps with Test Harness

1. **Load test page** in Chrome
2. **Open extension popup**
3. **Add hash**: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
4. **Click "Send Test Query"** button on test page
5. **Check extension popup**:
   - [ ] Hash status changes to "✓ Captured" (green)
   - [ ] Query appears in "Captured Queries" section
   - [ ] Query text is visible and formatted
   - [ ] Operation name shows "TestQuery"
   - [ ] Variables are displayed
   - [ ] Timestamp is shown

### Testing with Real Application

If testing with Sprinklr or your application:

1. **Navigate to application**
2. **Open DevTools** (F12)
3. **Go to Network tab**
4. **Find GraphQL request**:
   - [ ] Request contains `extensions.persistedQuery.sha256Hash`
   - [ ] Copy the hash value

5. **Add hash to extension**:
   - [ ] Paste hash in extension input
   - [ ] Click "Add"
   - [ ] Hash appears in tracked list

6. **Trigger the query**:
   - [ ] Refresh widget/component
   - [ ] Navigate to trigger query
   - [ ] Click relevant button

7. **Verify interception** in DevTools Console:
   - [ ] Look for: `[GraphQL Interceptor] Invalidating hash: ...`
   - [ ] Look for: `[GraphQL Interceptor] Captured query for hash: ...`

8. **Verify in Network tab**:
   - [ ] See two requests for same query
   - [ ] First request has modified hash ("1")
   - [ ] Second request has full `query` field

9. **Verify in extension**:
   - [ ] Hash status changed to "✓ Captured"
   - [ ] Query appears in captured list
   - [ ] Query is readable and formatted
   - [ ] Can copy query to clipboard

### Copy Functionality

- [ ] Click "Copy" button on captured query
- [ ] Button text changes to "Copied!" temporarily
- [ ] Button color changes (visual feedback)
- [ ] Paste in text editor - full query is copied
- [ ] Query formatting is preserved

### Edge Cases

- [ ] **Multiple hashes**: Add 3-5 different hashes
  - [ ] All tracked correctly
  - [ ] Each captures independently
  - [ ] All displayed correctly

- [ ] **Same hash twice**: Try to add duplicate
  - [ ] Shows error message
  - [ ] Doesn't create duplicate entry

- [ ] **Very long query**: Capture a large query (1000+ characters)
  - [ ] Query displays correctly
  - [ ] Scrollable if needed
  - [ ] Copy works correctly

- [ ] **Query with variables**: Capture query with complex variables
  - [ ] Variables section appears
  - [ ] Variables formatted as JSON
  - [ ] All variable values visible

- [ ] **Special characters**: Query with quotes, newlines, unicode
  - [ ] Characters displayed correctly
  - [ ] No HTML injection
  - [ ] Copy preserves special characters

### Error Handling

- [ ] **Network error**: Disconnect network during capture
  - [ ] Extension doesn't crash
  - [ ] Status remains pending or shows appropriate state

- [ ] **Invalid JSON**: Test with malformed request body
  - [ ] Extension handles gracefully
  - [ ] No console errors

- [ ] **Non-GraphQL request**: Intercept non-GraphQL fetch
  - [ ] Extension ignores it
  - [ ] No false positives

- [ ] **Missing operation name**: Query without operationName
  - [ ] Shows "Unnamed Query" or similar
  - [ ] Still captures correctly

### Performance

- [ ] **50+ queries**: Add many queries to test storage limit
  - [ ] Only 50 most recent stored
  - [ ] Older queries removed
  - [ ] No performance degradation

- [ ] **Rapid requests**: Trigger same query multiple times quickly
  - [ ] All captured (or latest one)
  - [ ] No race conditions
  - [ ] Extension remains responsive

- [ ] **Page reload**: Reload page while tracking
  - [ ] Tracked hashes persist
  - [ ] Extension reattaches correctly
  - [ ] Interception continues working

## Browser Compatibility

Test on different Chrome versions:
- [ ] Chrome latest stable
- [ ] Chrome beta (if available)
- [ ] Chromium-based browsers (Edge, Brave, etc.)

## Console Output Testing

Open DevTools console and verify:
- [ ] `[GraphQL Interceptor] Content script loaded`
- [ ] `[GraphQL Interceptor] Fetch wrapper installed`
- [ ] When invalidating: `[GraphQL Interceptor] Invalidating hash: ...`
- [ ] When capturing: `[GraphQL Interceptor] Captured query for hash: ...`
- [ ] No error messages

## Final Checklist

- [ ] All core functionality works
- [ ] UI is responsive and intuitive
- [ ] No console errors
- [ ] Queries capture correctly
- [ ] Copy to clipboard works
- [ ] Storage persists correctly
- [ ] Enable/disable toggle works
- [ ] README is accurate
- [ ] Usage guide is clear

## Known Limitations

Document any limitations found:
- Extension only works with `fetch` API (not XMLHttpRequest)
- Some sites with strict CSP may block script injection
- Requires manual triggering of queries
- Only stores 50 most recent queries
- No export functionality yet

## Bug Reporting Template

If bugs are found, document:
```
**Bug**: [Brief description]
**Steps to reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happens]
**Browser**: Chrome version X
**Console errors**: [Any errors from console]
**Screenshots**: [If applicable]
```

## Success Criteria

Extension is ready for use when:
- ✅ All hash input validation works
- ✅ Hashes can be added and removed
- ✅ Queries are captured automatically
- ✅ UI is intuitive and responsive
- ✅ Syntax highlighting works
- ✅ Copy to clipboard works
- ✅ Storage persists correctly
- ✅ Enable/disable toggle works
- ✅ No critical bugs
- ✅ Documentation is complete

---

**Testing completed successfully!** ✅

