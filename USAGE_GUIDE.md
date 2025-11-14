# Quick Usage Guide

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `graphql-query-interceptor` folder
5. Done! The extension icon appears in your toolbar

## Getting Query Hashes

### Method 1: From Network Tab (Recommended)

1. Open your web application
2. Press `F12` to open DevTools
3. Click the **Network** tab
4. Filter by "Fetch/XHR" or your GraphQL endpoint (e.g., `/graphql`)
5. Trigger an action that makes a GraphQL request
6. Click on the GraphQL request in the list
7. Click the **Payload** or **Request** tab
8. Look for `extensions` → `persistedQuery` → `sha256Hash`
9. **Copy** this hash value (64-character hexadecimal string)

Example:
```json
{
  "extensions": {
    "persistedQuery": {
      "version": 1,
      "sha256Hash": "abc123...def456"  ← Copy this
    }
  }
}
```

### Method 2: From Request Headers

Some applications send the hash in headers:
1. In Network tab, click the request
2. Go to **Headers** tab
3. Look for custom headers like `X-Apollo-Query-Hash` or similar
4. Copy the hash value

## Using the Extension

### Step-by-Step

1. **Click the extension icon** in your Chrome toolbar
   - The popup opens showing three sections

2. **Paste the hash** in the input field at the top
   - The field accepts 64-character hexadecimal strings
   - Invalid hashes show an error message

3. **Click "Add" button**
   - Hash appears in "Tracked Hashes" list
   - Status shows "⏳ Pending" (yellow)

4. **Trigger the query on your webpage**
   - Refresh the component/widget
   - Navigate to trigger the request
   - Click a button that makes the query
   - Use DevTools to resend the request

5. **Watch the magic happen**
   - Extension intercepts the request
   - Invalidates the hash automatically
   - Application retries with full query
   - Query appears in "Captured Queries" section
   - Status changes to "✓ Captured" (green)

6. **Copy the query**
   - Click the "Copy" button on any captured query
   - Paste into your GraphQL IDE, tests, or docs

## Tips & Tricks

### Quick Copy from DevTools

Right-click on the hash value in DevTools → "Copy string contents"

### Multiple Hashes

You can track multiple hashes simultaneously:
- Add each hash one at a time
- All tracked hashes are monitored
- Each capture updates independently

### Triggering Queries

Different ways to trigger GraphQL queries:

**1. Refresh Component:**
- Find the refresh/reload button on the widget
- Click it to re-fetch data

**2. Navigate Away and Back:**
- Go to a different page
- Return to trigger component re-mount

**3. Resend in DevTools:**
- Right-click on the request in Network tab
- Select "Replay XHR" or "Copy as fetch"

**4. Clear Cache:**
- Some apps cache responses
- Try clearing browser cache if query doesn't trigger

### Managing Hashes

**Remove Single Hash:**
- Click "Remove" button next to any hash
- Stops tracking that specific hash

**Clear All Hashes:**
- Click "Clear All" in Tracked Hashes section
- Removes all tracked hashes and captured queries

**Clear Queries Only:**
- Click "Clear All" in Captured Queries section
- Keeps tracked hashes but removes captured queries

### Enable/Disable

**Toggle Switch (top-right):**
- Green = Active: Interception is ON
- Red = Inactive: Interception is OFF
- Useful when you want to pause without removing hashes

## Common Scenarios

### Scenario 1: Debugging a Widget

**Problem:** Widget shows error, need to see the query

1. Copy hash from failed request in Network tab
2. Add hash to extension
3. Click widget's refresh button
4. View full query in extension
5. Copy query to test in GraphQL IDE

### Scenario 2: Documentation

**Problem:** Need to document all queries used by a feature

1. Navigate through the feature
2. Copy hashes from each GraphQL request
3. Add all hashes to extension
4. Refresh the feature
5. Export/copy all captured queries
6. Use in documentation

### Scenario 3: Testing

**Problem:** Need actual queries for integration tests

1. Perform user actions in the app
2. Track hashes from those actions
3. Trigger the actions to capture queries
4. Copy queries to test files
5. Use for mocking or integration tests

## Troubleshooting

### Hash Not Capturing

**Status stays "Pending":**
- Make sure you triggered the query after adding the hash
- Check that toggle is "Active" (green)
- Verify the hash is correct (64 hex characters)
- Try refreshing the webpage

### No Hash in Network Tab

**Can't find sha256Hash:**
- Look in Request Payload, not Response
- Try different GraphQL requests
- Application might not use persisted queries
- Check Headers for custom hash fields

### Query Not Formatted

**Query appears as one line:**
- This is normal for some queries
- The extension adds basic formatting
- Copy to GraphQL IDE for better formatting

### Extension Not Working

**No queries captured:**
1. Reload extension: `chrome://extensions/` → Click reload icon
2. Refresh webpage
3. Check browser console for errors (F12)
4. Verify hash is exactly 64 characters

## Advanced Usage

### Finding Operation Names

The extension extracts operation names from queries:
- Shown at the top of each captured query
- Helps identify what each query does
- Uses format: `query OperationName { ... }`

### Understanding Variables

If a query has variables, they're shown below the query:
- JSON format
- Shows actual values used
- Useful for debugging parameter issues

### Storage & Persistence

- Tracked hashes persist across browser sessions
- Captured queries stored locally (up to 50)
- Oldest queries removed automatically
- No data sent to external servers

## Best Practices

1. **Remove after capturing**: Delete hashes once you have the query
2. **Clear regularly**: Clear old queries to keep list manageable
3. **Document hashes**: Keep a note of which hash corresponds to which feature
4. **Test in dev**: Use in development/staging environments first
5. **Share with team**: Export captured queries to share with colleagues

## Keyboard Shortcuts

- `Enter` in hash input field = Add hash
- `Ctrl/Cmd + C` on query = Copy (via Copy button)

## What Gets Captured

For each query, the extension captures:
- ✅ Full GraphQL query text
- ✅ Operation name (if present)
- ✅ Variables (if present)
- ✅ Original hash reference
- ✅ Timestamp of capture
- ✅ Request URL (internally)

## Privacy

- All data stored locally in your browser
- No external servers contacted
- No analytics or tracking
- Data cleared when you clear browser data

---

Need help? Check the main README.md or open DevTools console for error messages.

