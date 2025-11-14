# Quick Start Guide

Get up and running with GraphQL Query Interceptor in 5 minutes!

## 📦 Installation (2 minutes)

### Step 1: Load Extension

1. Open Chrome
2. Type `chrome://extensions/` in the address bar
3. Enable **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Navigate to and select the `graphql-query-interceptor` folder
6. ✅ Done! The extension icon appears in your toolbar

### Step 2: Generate Icons (Optional)

If you want proper icons instead of the default puzzle piece:

1. Open `icons/generate-icons.html` in your browser
2. Click the three download buttons
3. Save the files as `icon16.png`, `icon48.png`, `icon128.png`
4. Place them in the `icons/` folder
5. Reload the extension at `chrome://extensions/`

## 🧪 Test It (3 minutes)

### Quick Test with Test Page

1. Open `test-page.html` in Chrome (just double-click it)
2. Copy the first hash by clicking it (starts with "aaaa...")
3. Click the extension icon in your toolbar
4. Paste the hash and click **"Add"**
5. Go back to the test page
6. Click **"Send Test Query 1"**
7. Return to extension popup
8. 🎉 See your captured query!

### Test with Real Application

1. Navigate to your GraphQL application (e.g., Sprinklr)
2. Open DevTools (F12)
3. Go to **Network** tab
4. Trigger a GraphQL request
5. Click the request and find `extensions.persistedQuery.sha256Hash`
6. **Copy** that hash value
7. Open extension popup
8. **Paste** the hash and click **"Add"**
9. Trigger the same query again on your app
10. 🎉 Full query captured in extension!

## 💡 Basic Usage

### The 3-Step Process

```
1. COPY hash from Network tab
   └─> Look for extensions.persistedQuery.sha256Hash

2. ADD hash to extension
   └─> Paste in input field, click "Add"

3. TRIGGER query on webpage
   └─> Refresh widget, navigate, or click button
```

### What You'll See

**Before triggering:**
```
⏳ Pending (yellow indicator)
```

**After triggering:**
```
✓ Captured (green indicator)
Full query displayed with:
- Operation name
- Formatted GraphQL
- Variables
- Copy button
```

## 🎯 Common Use Cases

### Case 1: Debug a Failing Query

```bash
Problem: Widget shows error, need to see actual query

Solution:
1. Copy hash from failed request
2. Add to extension
3. Refresh widget
4. See full query + variables
5. Test in GraphQL IDE
```

### Case 2: Document API Usage

```bash
Problem: Need queries for documentation

Solution:
1. Perform user flow
2. Copy all hashes from Network tab
3. Add each to extension
4. Replay the flow
5. Copy all captured queries
6. Add to docs
```

### Case 3: Create Tests

```bash
Problem: Need actual queries for tests

Solution:
1. Use application normally
2. Track relevant hashes
3. Capture queries
4. Copy to test files
5. Use for mocking
```

## 🔧 Keyboard Shortcuts

- **Enter** in hash input = Add hash
- **Click hash display** in test page = Copy to clipboard
- **Ctrl/Cmd + C** = Copy (after clicking Copy button)

## ⚙️ Settings

### Enable/Disable

Toggle switch in header:
- **Green** = Active (intercepting)
- **Red** = Inactive (not intercepting)

### Clear Data

- **Clear All** in Tracked Hashes = Removes all hashes
- **Clear All** in Captured Queries = Removes captured data

## 🐛 Troubleshooting

### Hash Not Capturing?

✅ **Check these:**
- Toggle is ON (green)
- Hash is correct (64 hex characters)
- You triggered the query AFTER adding hash
- Query uses `fetch` API (not XHR)

### Extension Not Working?

✅ **Try these:**
1. Reload extension: `chrome://extensions/` → reload icon
2. Refresh webpage
3. Check console for errors (F12)
4. Verify extension is enabled

### Can't Find Hash?

✅ **Look for:**
- Network tab → Filter by your GraphQL endpoint
- Request tab → Payload section
- `extensions` → `persistedQuery` → `sha256Hash`

If not found, your app might not use persisted queries.

## 📚 Learn More

- **Full Documentation**: See `README.md`
- **Detailed Usage**: See `USAGE_GUIDE.md`
- **Testing Guide**: See `TESTING.md`
- **Updates**: See `CHANGELOG.md`

## 🎓 Tips for Success

1. **Test First**: Use `test-page.html` to verify extension works
2. **One Hash at a Time**: Start with one query to understand the flow
3. **Check Console**: Open DevTools to see interception logs
4. **Copy Immediately**: Copy queries right after capture
5. **Clean Up**: Remove hashes after you've captured their queries

## 🚀 Next Steps

Now that you're set up:

1. ✅ Test with the included test page
2. ✅ Try with your real application
3. ✅ Explore the full documentation
4. ✅ Share with your team!

---

**Need Help?**

- Check the Troubleshooting section above
- See `TESTING.md` for detailed testing info
- Look at console for error messages
- Ensure extension permissions are granted

---

**Happy Debugging! 🎉**

The extension is ready to use. Start by opening the test page or your application!

