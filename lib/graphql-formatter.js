// GraphQL Query Formatter Library
// Provides syntax highlighting and formatting for GraphQL queries

export function formatGraphQLQuery(query) {
  if (!query) return '';
  
  // Remove extra whitespace and normalize
  let formatted = query.trim().replace(/\s+/g, ' ');
  
  // Add proper indentation
  let indent = 0;
  let result = '';
  let inString = false;
  let stringChar = null;
  
  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i];
    const prevChar = formatted[i - 1];
    const nextChar = formatted[i + 1];
    
    // Handle strings
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
    }
    
    if (inString) {
      result += char;
      continue;
    }
    
    // Handle braces and formatting
    if (char === '{') {
      result += ' ' + char;
      if (nextChar !== '}') {
        indent++;
        result += '\n' + '  '.repeat(indent);
      }
    } else if (char === '}') {
      if (prevChar !== '{') {
        indent = Math.max(0, indent - 1);
        result = result.trimEnd() + '\n' + '  '.repeat(indent);
      }
      result += char;
    } else if (char === '(' || char === '[') {
      result += char;
    } else if (char === ')' || char === ']') {
      result += char;
    } else if (char === ',' && nextChar === ' ') {
      result += char + '\n' + '  '.repeat(indent);
      i++; // Skip the space
    } else {
      result += char;
    }
  }
  
  return result;
}

export function highlightGraphQL(query) {
  if (!query) return '';
  
  const keywords = ['query', 'mutation', 'subscription', 'fragment', 'on', 'true', 'false', 'null'];
  const types = ['String', 'Int', 'Float', 'Boolean', 'ID'];
  
  let highlighted = query;
  
  // Highlight keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    highlighted = highlighted.replace(regex, `<span class="gql-keyword">${keyword}</span>`);
  });
  
  // Highlight types
  types.forEach(type => {
    const regex = new RegExp(`\\b${type}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="gql-type">${type}</span>`);
  });
  
  // Highlight strings
  highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="gql-string">"$1"</span>');
  
  // Highlight comments
  highlighted = highlighted.replace(/#(.*)$/gm, '<span class="gql-comment">#$1</span>');
  
  return highlighted;
}

export function extractOperationName(query) {
  if (!query) return 'Unnamed';
  
  // Try to extract operation name from query/mutation/subscription
  const match = query.match(/(?:query|mutation|subscription)\s+(\w+)/);
  if (match && match[1]) {
    return match[1];
  }
  
  // Try to find any operation type
  if (query.includes('mutation')) return 'Mutation';
  if (query.includes('subscription')) return 'Subscription';
  if (query.includes('query')) return 'Query';
  
  return 'Operation';
}

export function validateGraphQLQuery(query) {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Query must be a non-empty string' };
  }
  
  // Basic validation - check for balanced braces
  let braceCount = 0;
  let parenCount = 0;
  let bracketCount = 0;
  
  for (const char of query) {
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (char === '[') bracketCount++;
    if (char === ']') bracketCount--;
    
    if (braceCount < 0 || parenCount < 0 || bracketCount < 0) {
      return { valid: false, error: 'Unbalanced brackets' };
    }
  }
  
  if (braceCount !== 0) {
    return { valid: false, error: 'Unbalanced curly braces' };
  }
  if (parenCount !== 0) {
    return { valid: false, error: 'Unbalanced parentheses' };
  }
  if (bracketCount !== 0) {
    return { valid: false, error: 'Unbalanced square brackets' };
  }
  
  return { valid: true };
}

