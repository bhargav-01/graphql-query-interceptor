# Changelog

All notable changes to the GraphQL Query Interceptor extension will be documented in this file.

## [1.1.0] - 2024-01-14

### 🎨 Major UI Overhaul
- **Modern Design System**: Complete redesign with contemporary UI patterns
- **CSS Variables**: Implemented design tokens for consistent theming
- **Card-Based Layout**: Enhanced visual hierarchy with shadow system
- **Smooth Animations**: Added fade-in, slide-in, and hover animations
- **Better Typography**: Improved fonts, sizing, and spacing
- **Color Palette**: Updated to modern, accessible color scheme
- **Glassmorphism Effects**: Added backdrop filters for depth
- **Improved Shadows**: Multi-level shadow system for better depth perception
- **Status Badges**: Redesigned with modern pill-style badges
- **Better Buttons**: Enhanced with gradients and smooth transitions
- **Query Cards**: Elevated card design with hover effects
- **Code Display**: Improved syntax highlighting with dark theme
- **Success Notifications**: Redesigned with slide-in animations
- **Empty States**: More engaging placeholder content
- **Responsive**: Better mobile/small screen support

### Improved
- 📱 **Better UX**: More intuitive interactions and visual feedback
- 🎯 **Focus States**: Clear focus indicators for accessibility
- ⚡ **Performance**: Optimized animations with GPU acceleration
- 📐 **Spacing**: Consistent 8px grid system throughout
- 🎭 **Hover States**: All interactive elements have smooth hover effects

## [1.0.1] - 2024-01-14

### Fixed
- 🐛 **Popup Refresh Issue**: Removed auto-refresh interval that caused UI to refresh every 2 seconds
- ✨ **Smart Updates**: Now uses Chrome storage change listeners for instant, efficient updates
- 🎯 **CSP Compatibility**: Fixed script injection to work with strict Content Security Policy (Sprinklr compatible)
- 📝 **Better Logging**: Added comprehensive console logging for easier debugging

### Changed
- 📦 **Script Injection**: Moved from inline script to external `injected.js` file
- 🔧 **Manifest**: Added `web_accessible_resources` for injected script
- ⚡ **Performance**: UI only updates when data actually changes, not on timer

## [1.0.0] - 2024-01-14

### Added
- ✨ Initial release of GraphQL Query Interceptor Chrome Extension
- 🎯 Manual hash tracking interface
- 🔄 Automatic query capture through fetch interception
- 💾 Persistent storage for tracked hashes
- 🎨 Beautiful popup UI with three main sections:
  - Hash input and validation
  - Tracked hashes list with status indicators
  - Captured queries display
- 📋 One-click copy to clipboard functionality
- 🎨 GraphQL syntax highlighting for captured queries
- 🔧 Enable/disable toggle for interception
- 📝 Comprehensive documentation:
  - README.md with full feature list
  - USAGE_GUIDE.md with step-by-step instructions
  - TESTING.md with complete testing checklist
- 🧪 Test page (test-page.html) for easy testing
- 🎨 Icon generator utility

### Features
- **Hash Management**:
  - Add hash via input field
  - Remove individual hashes
  - Clear all hashes at once
  - Validation for proper sha256 format (64 hex characters)
  
- **Query Capture**:
  - Automatic hash invalidation
  - Capture retry requests with full query
  - Display operation name, variables, and timestamp
  - Format GraphQL queries with indentation
  
- **Storage**:
  - Persist tracked hashes across sessions
  - Store up to 50 most recent queries
  - Auto-cleanup of old queries
  
- **UI/UX**:
  - Real-time status updates (Pending/Captured)
  - Visual feedback for all actions
  - Responsive design
  - Dark theme for code display
  - Copy success animation

### Technical Details
- **Manifest Version**: 3
- **Permissions**: storage, activeTab, scripting
- **Host Permissions**: <all_urls>
- **Architecture**:
  - Background service worker for message handling
  - Content script for fetch interception
  - Popup UI for user interaction

### Browser Compatibility
- Chrome 88+ (Manifest V3 support)
- Chromium-based browsers (Edge, Brave, etc.)

### Known Limitations
- Only intercepts `fetch` API (not XMLHttpRequest)
- Requires manual triggering of queries after adding hash
- Maximum 50 stored queries
- No export functionality yet

### Documentation
- Complete README with installation and usage
- Quick usage guide with examples
- Comprehensive testing documentation
- Test harness for development

---

## Future Enhancements (Planned)

### v1.1.0
- [ ] Export queries to file (.graphql, .json)
- [ ] Search/filter captured queries
- [ ] Batch operations for hashes
- [ ] Better syntax highlighting colors

### v1.2.0
- [ ] DevTools panel integration
- [ ] XMLHttpRequest support
- [ ] Auto-trigger query detection
- [ ] Query comparison tool

### v2.0.0
- [ ] Automatic hash detection (no manual input)
- [ ] Query history with search
- [ ] Team sharing features
- [ ] Cloud sync (optional)

---

## Bug Fixes

None yet - this is the initial release!

---

## Contributing

Contributions are welcome! Please see README.md for guidelines.

## License

This project is provided as-is for development and debugging purposes.

