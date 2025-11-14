# Contributing to GraphQL Query Interceptor

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Types of Contributions

We welcome:
- 🐛 **Bug Reports**: Found an issue? Let us know!
- ✨ **Feature Requests**: Have an idea? Suggest it!
- 📝 **Documentation**: Improve guides and examples
- 💻 **Code**: Implement features or fix bugs
- 🧪 **Testing**: Help test on different platforms

## 🚀 Getting Started

### Prerequisites

- Chrome browser (latest version)
- Basic knowledge of:
  - JavaScript (ES6+)
  - Chrome Extension API
  - GraphQL concepts
  - Git

### Setup Development Environment

1. **Clone or Download** the repository
2. **Load in Chrome**:
   ```
   chrome://extensions/ → Developer mode → Load unpacked
   ```
3. **Make Changes** to the code
4. **Reload Extension**:
   ```
   Click reload icon on extension card
   ```
5. **Test Changes**:
   ```
   Open test-page.html or test with real applications
   ```

## 📝 Development Guidelines

### Code Style

#### JavaScript
- Use ES6+ features
- Use `const` and `let`, not `var`
- Use arrow functions for callbacks
- Use async/await for promises
- Add JSDoc comments for functions
- Keep functions small and focused

```javascript
// Good
async function captureQuery(queryData) {
  const queries = await getCapturedQueries();
  // ... implementation
}

// Bad
function captureQuery(queryData) {
  return new Promise((resolve) => {
    // ... nested callbacks
  });
}
```

#### HTML
- Use semantic HTML5 elements
- Add ARIA labels for accessibility
- Keep structure clean and organized
- Use data attributes for JavaScript hooks

#### CSS
- Use meaningful class names
- Organize by component
- Use CSS variables for colors
- Mobile-first approach
- Add transitions for interactions

### File Organization

```
graphql-query-interceptor/
├── *.js              # Core extension files
├── popup/            # Popup UI files
├── lib/              # Utility libraries
├── icons/            # Extension icons
├── *.md              # Documentation
└── test-page.html    # Testing harness
```

### Naming Conventions

- **Files**: `kebab-case.js`
- **Functions**: `camelCase()`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **CSS Classes**: `kebab-case`
- **IDs**: `camelCase`

## 🔧 Making Changes

### For Bug Fixes

1. **Identify the bug**:
   - Reproduce the issue
   - Note the steps to reproduce
   - Check console for errors

2. **Create a fix**:
   - Make minimal changes
   - Add error handling if needed
   - Test the fix thoroughly

3. **Document the fix**:
   - Add code comments explaining the fix
   - Update CHANGELOG.md

### For New Features

1. **Plan the feature**:
   - Check if it aligns with project goals
   - Consider user experience
   - Think about edge cases

2. **Implement the feature**:
   - Follow existing code patterns
   - Keep it modular
   - Add error handling

3. **Test thoroughly**:
   - Test normal usage
   - Test edge cases
   - Test with real applications

4. **Document the feature**:
   - Update README.md
   - Update USAGE_GUIDE.md if needed
   - Add to CHANGELOG.md

### For Documentation

1. **Keep it clear**:
   - Use simple language
   - Add examples
   - Include screenshots if helpful

2. **Keep it organized**:
   - Use consistent formatting
   - Add table of contents for long docs
   - Link related documents

3. **Keep it updated**:
   - Update when code changes
   - Fix typos and errors
   - Improve explanations

## 🧪 Testing

### Before Submitting

- [ ] Extension loads without errors
- [ ] No console errors
- [ ] All existing features still work
- [ ] New feature works as expected
- [ ] Tested with test-page.html
- [ ] Tested with real application
- [ ] Documentation updated
- [ ] No linter errors

### Testing Checklist

See `TESTING.md` for comprehensive testing procedures.

### Test With

- **Test Page**: `test-page.html` (included)
- **Real Apps**: Sprinklr, Apollo apps, etc.
- **Different Browsers**: Chrome, Edge, Brave

## 📚 Code Areas

### Background Script (`background.js`)

- Message handling
- Storage management
- Helper functions
- Cross-component communication

**When to modify:**
- Adding new message types
- Changing storage structure
- Adding new storage helpers

### Content Script (`content.js`)

- Fetch interception
- Hash invalidation
- Query capture
- Page injection

**When to modify:**
- Changing interception logic
- Supporting new request formats
- Improving capture mechanism

### Popup UI (`popup/`)

- User interface
- Display logic
- User interactions
- Visual feedback

**When to modify:**
- Adding UI features
- Improving styling
- Enhancing user experience

### Utilities (`lib/`)

- Helper functions
- Formatting utilities
- Shared code

**When to modify:**
- Adding reusable utilities
- Improving formatters
- Adding validators

## 🎨 UI/UX Guidelines

### Design Principles

1. **Clarity**: Users should understand what each element does
2. **Feedback**: Every action should have visual feedback
3. **Simplicity**: Keep interface clean and uncluttered
4. **Consistency**: Use consistent colors, spacing, and patterns

### Colors

Current color scheme:
- **Primary**: `#667eea` (purple-blue)
- **Secondary**: `#764ba2` (purple)
- **Success**: `#4caf50` (green)
- **Error**: `#ef5350` (red)
- **Warning**: `#ffa726` (orange)
- **Text**: `#333333` (dark gray)
- **Background**: `#f5f5f5` (light gray)

### Spacing

- Use 8px grid system
- Consistent padding: 12px, 16px, 20px
- Consistent margins: 8px, 12px, 16px, 20px

## 🐛 Bug Reports

When reporting bugs, include:

```markdown
### Bug Description
[Clear description of the bug]

### Steps to Reproduce
1. Step one
2. Step two
3. Step three

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: Chrome version X
- Extension version: X.X.X
- OS: Windows/Mac/Linux

### Console Errors
[Any errors from console]

### Screenshots
[If applicable]
```

## ✨ Feature Requests

When requesting features, include:

```markdown
### Feature Description
[Clear description of the feature]

### Use Case
[Why is this feature needed?]

### Proposed Solution
[How should it work?]

### Alternatives Considered
[Other ways to solve this]

### Additional Context
[Screenshots, examples, etc.]
```

## 📋 Pull Request Process

If contributing code:

1. **Before starting**:
   - Check existing features
   - Discuss major changes first

2. **Development**:
   - Follow code style guidelines
   - Add comments for complex logic
   - Test thoroughly

3. **Documentation**:
   - Update relevant docs
   - Add usage examples
   - Update CHANGELOG.md

4. **Submit**:
   - Clear description of changes
   - Reference related issues
   - Include screenshots if UI changes

## 🎯 Priority Areas

Current priorities:

1. **High Priority**:
   - Bug fixes
   - Security improvements
   - Performance optimization

2. **Medium Priority**:
   - Export functionality
   - Search/filter queries
   - XMLHttpRequest support

3. **Low Priority**:
   - DevTools integration
   - Cloud sync
   - Advanced features

## 💡 Ideas for Contribution

Good starter tasks:

- **Easy**:
  - Fix typos in documentation
  - Improve error messages
  - Add more test cases
  - Enhance CSS styling

- **Medium**:
  - Add export to file feature
  - Implement search/filter
  - Improve syntax highlighting
  - Add keyboard shortcuts

- **Hard**:
  - DevTools panel integration
  - XMLHttpRequest support
  - Auto-detection of hashes
  - Query diffing tool

## 🔍 Code Review Checklist

Reviewers will check:

- [ ] Code follows style guidelines
- [ ] No unnecessary changes
- [ ] Proper error handling
- [ ] No console.log statements (use proper logging)
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No linter errors

## 📖 Resources

### Chrome Extension Development
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

### GraphQL
- [GraphQL Spec](https://graphql.org/learn/)
- [Persisted Queries](https://www.apollographql.com/docs/apollo-server/performance/apq/)

### Project Documentation
- README.md - Project overview
- USAGE_GUIDE.md - Usage instructions
- TESTING.md - Testing procedures
- QUICKSTART.md - Quick start guide

## 🤝 Community

### Communication

- Be respectful and constructive
- Help others when you can
- Share your experiences
- Celebrate successes

### Best Practices

1. **Ask questions** if unsure
2. **Share ideas** early
3. **Test thoroughly** before submitting
4. **Document clearly** for others
5. **Be patient** with reviews

## 📝 License

By contributing, you agree that your contributions will be provided under the same license as the project.

## 🙏 Thank You!

Every contribution, no matter how small, helps improve the project. Thank you for taking the time to contribute!

---

**Questions?** Feel free to ask by opening an issue or checking existing documentation.

**Ready to contribute?** Great! Start by loading the extension and trying it out.

**Need ideas?** Check the "Ideas for Contribution" section above.

---

*Happy Contributing! 🚀*

