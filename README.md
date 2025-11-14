# GraphQL Query Interceptor - Chrome Extension

A Chrome extension that helps developers intercept and view full GraphQL queries from applications using persisted query hashes. No more manual console commands!

## 🎯 Problem It Solves

Many GraphQL applications use **persisted queries** to optimize network traffic by sending only a hash (sha256) instead of the full query. This makes debugging difficult because developers can't see the actual query being executed.

**Traditional Method** (Manual):
1. Open DevTools Console
2. Paste complex JavaScript code to wrap `fetch`
3. Copy hash from Network tab
4. Add hash to blocked list
5. Trigger the query again
6. Look for full query in Network tab
7. Repeat for each query

**With This Extension** (Automated):
1. Click extension icon
2. Paste the hash
3. Click "Add"
4. Trigger the query on the webpage
5. Done! Full query appears automatically

## ✨ Features

- 🎯 **Manual Hash Tracking**: Add specific query hashes you want to intercept
- 🔄 **Automatic Query Capture**: Automatically invalidates hashes and captures full queries
- 📋 **Easy Copy**: One-click copy to clipboard
- 🎨 **Syntax Highlighting**: Beautiful GraphQL query formatting
- 💾 **Persistent Storage**: Tracked hashes saved across browser sessions
- 🔍 **Query Metadata**: Shows operation name, variables, and timestamps
- ⚡ **Real-time Updates**: UI updates automatically when queries are captured
- 🎚️ **Enable/Disable Toggle**: Turn interception on/off without removing hashes

## 🚀 Installation

### From Source (Development)

1. **Clone or Download** this repository
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the `graphql-query-interceptor` folder
6. The extension icon should appear in your toolbar

### Creating Icons (Optional)

The extension needs three icon files in the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

See `icons/README.md` for details on creating these.

## 📖 How to Use

### Step 1: Find the Query Hash

1. Open your web application
2. Open Chrome DevTools (F12 or Cmd+Option+I)
3. Go to the **Network** tab
4. Filter by "Fetch/XHR" or your GraphQL endpoint
5. Click on a GraphQL request
6. Look in the **Payload** or **Request** tab
7. Find the `extensions.persistedQuery.sha256Hash` value
8. **Copy** this hash

### Step 2: Add Hash to Extension

1. Click the **GraphQL Query Interceptor** extension icon
2. Paste the hash into the input field
3. Click **"Add"** button
4. The hash appears in the "Tracked Hashes" list with "⏳ Pending" status

### Step 3: Trigger the Query

1. On your webpage, trigger the same GraphQL query again:
   - Refresh a widget/component
   - Navigate to trigger the query
   - Click a button that makes the request
   - Or use DevTools to resend the request

### Step 4: View the Full Query

1. The extension automatically:
   - Intercepts the request
   - Invalidates the hash (changes it to "1")
   - Forces the app to retry with the full query
   - Captures the full query text

2. The query appears in the "Captured Queries" section with:
   - ✓ Operation name
   - ✓ Full GraphQL query text (formatted)
   - ✓ Variables (if any)
   - ✓ Timestamp
   - ✓ Copy button

### Step 5: Use the Query

1. Click **"Copy"** to copy the full query to your clipboard
2. Use it in your GraphQL IDE, tests, or documentation
3. Remove the hash from tracking if no longer needed

## 🎨 User Interface

### Header
- **Extension Name**: GraphQL Query Interceptor
- **Toggle Switch**: Enable/Disable interception
- **Status Indicator**: Shows "Active" or "Inactive"

### Hash Input Section
- **Input Field**: Paste your sha256Hash here
- **Add Button**: Add hash to tracking list
- **Help Text**: Instructions for users
- **Validation**: Shows error for invalid hashes

### Tracked Hashes Section
- **List of Hashes**: Shows all tracked hashes
- **Status Badge**: 
  - 🟡 **Pending**: Waiting for query to be triggered
  - 🟢 **Captured**: Full query successfully captured
- **Remove Button**: Stop tracking a specific hash
- **Clear All Button**: Remove all tracked hashes

### Captured Queries Section
- **Query Cards**: Shows captured queries with:
  - Operation name
  - Hash reference (truncated)
  - Timestamp
  - Formatted GraphQL query
  - Variables (if present)
  - Copy button
- **Clear All Button**: Clear all captured queries

## 🔧 Technical Details

### How It Works

1. **Content Script Injection**: 
   - Injects into all web pages at `document_start`
   - Wraps `window.fetch` to intercept GraphQL requests

2. **Hash Detection**:
   - Looks for `extensions.persistedQuery.sha256Hash` in request body
   - Checks if hash is in tracked list

3. **Hash Invalidation**:
   - Changes `sha256Hash` to "1" (invalid hash)
   - Server returns error for invalid persisted query

4. **Query Capture**:
   - Application retries with full `query` field
   - Extension captures the full query text
   - Stores query with metadata

5. **Storage**:
   - Uses `chrome.storage.local` for persistence
   - Stores up to 50 most recent queries
   - Survives browser restarts

### Architecture

```
┌─────────────────┐
│  Popup UI       │  ← User Interface
│  (popup.js)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Background     │  ← Message Handler & Storage
│  (background.js)│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Content Script │  ← Fetch Interceptor
│  (content.js)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Web Page       │  ← GraphQL Requests
│  (with fetch)   │
└─────────────────┘
```

### Files

- `manifest.json` - Extension configuration
- `background.js` - Background service worker
- `content.js` - Content script for fetch interception
- `popup/popup.html` - Popup UI structure
- `popup/popup.css` - Popup styling
- `popup/popup.js` - Popup logic
- `lib/graphql-formatter.js` - GraphQL formatting utilities
- `icons/` - Extension icons

## 🐛 Troubleshooting

### Hash Not Being Captured

1. **Check Toggle**: Make sure interception is "Active" (green)
2. **Verify Hash**: Hash must be exactly 64 hexadecimal characters
3. **Trigger Query**: You must trigger the query on the webpage after adding the hash
4. **Check Console**: Open DevTools console for any error messages

### Extension Not Working

1. **Reload Extension**: Go to `chrome://extensions/` and click the reload icon
2. **Reload Page**: Refresh the webpage you're testing on
3. **Check Permissions**: Ensure extension has necessary permissions
4. **Console Errors**: Check both extension console and page console

### Query Not Appearing

1. **Wait a Moment**: Give it a few seconds after triggering
2. **Check Status**: Look at the hash status in "Tracked Hashes"
3. **Retry Request**: Some apps may cache failed requests
4. **Different Endpoint**: Make sure the query goes through the same endpoint

## 🔒 Privacy & Security

- **No Data Collection**: Extension doesn't send any data externally
- **Local Storage Only**: All data stored locally in your browser
- **No Analytics**: No tracking or analytics
- **Open Source**: Code is fully visible and auditable

## 🤝 Contributing

Contributions are welcome! Here are some ways to improve:

- Add syntax highlighting with colors
- Export queries to file (.graphql, .json)
- Search/filter captured queries
- DevTools panel integration
- Support for other GraphQL client libraries
- Better error handling
- Unit tests

## 📝 License

This project is provided as-is for development and debugging purposes.

## 🙏 Acknowledgments

Based on the console method documented in the Sprinklr GraphQL debugging guide.

## 📧 Support

For issues or questions:
1. Check the Troubleshooting section
2. Open DevTools console for error messages
3. Reload the extension and webpage

---

**Happy Debugging! 🚀**

