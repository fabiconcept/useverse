# Profanity Guard 🚫

A flexible, production-ready TypeScript library for content moderation and profanity filtering with React hooks support.

[![npm version](https://badge.fury.io/js/@useverse/profanity-guard.svg)](https://www.npmjs.com/package/@useverse/profanity-guard)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-Hooks-61DAFB.svg)](https://reactjs.org/)

## ✨ Features

- 🎯 **Multiple Severity Levels** - MILD, MODERATE, SEVERE, and WTF classifications
- 🔧 **Flexible Moderation Modes** - OFF, RELAXED, MODERATE, and STRICT
- 🕵️ **Obfuscation Detection** - Catches common character substitutions (e.g., `@` for `a`, `3` for `e`)
- 📚 **Expandable Library** - Easily add, remove, or import custom word lists
- 🔄 **Smart Alternatives** - Replace profanity with appropriate alternatives
- 📊 **Detailed Results** - Get comprehensive information about detected words
- 💪 **TypeScript First** - Full type safety and IntelliSense support
- ⚡ **Performance Optimized** - Efficient pattern matching and caching

## 📦 Installation

```bash
npm install @useverse/profanity-guard
```

```bash
yarn add @useverse/profanity-guard
```

```bash
pnpm add @useverse/profanity-guard
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { ProfanityGuard, ModerationLevel } from '@useverse/profanity-guard';

// Create a moderator instance
const moderator = new ProfanityGuard(ModerationLevel.MODERATE);

// Check if content is clean
const isClean = moderator.isClean("Hello world!"); // true

// Get sanitized content
const sanitized = moderator.sanitize("This is some shit text");
// Output: "This is some **** text"

// Get detailed moderation results
const result = moderator.moderate("This shit text has ass in it");
console.log(result);
// {
//   isClean: false,
//   foundWords: ['shit', 'ass'],
//   severity: 'moderate',
//   isWTF: false,
//   sanitized: 'This **** text has *** in it',
//   matches: [
//     { word: 'shit', severity: 'moderate', position: 5 },
//     { word: 'ass', severity: 'moderate', position: 19 }
//   ]
// }
```

### React Hooks (Quick Start)

```tsx
import { useProfanityGuard, ModerationLevel } from '@useverse/profanity-guard';

function CommentForm() {
  const [comment, setComment] = useState('');
  const { moderate, sanitize } = useProfanityGuard({
    level: ModerationLevel.MODERATE
  });
  
  const result = moderate(comment);
  
  return (
    <div>
      <textarea 
        value={comment} 
        onChange={e => setComment(e.target.value)}
        placeholder="Enter your comment..."
      />
      {!result.isClean && (
        <p className="error">
          ⚠️ Contains inappropriate content: {result.foundWords.join(', ')}
        </p>
      )}
      <p>Preview: {sanitize(comment)}</p>
    </div>
  );
}
```

## 📚 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Core Concepts](#-core-concepts)
- [Usage Guide](#-usage-guide)
  - [Creating a Moderator](#creating-a-moderator)
  - [Moderation Levels](#moderation-levels)
  - [Basic Operations](#basic-operations)
  - [Custom Word Library](#custom-word-library)
- [React Hooks](#-react-hooks)
  - [useProfanityGuard](#useprofanityguard)
  - [useModeratedInput](#usemoderatedinput)
  - [useBatchModeration](#usebatchmoderation)
  - [useProfanityValidation](#useprofanityvalidation)
  - [useLiveSanitizer](#uselivesanitizer)
  - [useProfanityStats](#useprofanitystats)
  - [useContentReplacement](#usecontentreplacement)
- [Advanced Features](#-advanced-features)
- [Real-World Use Cases](#-real-world-use-cases)
- [API Reference](#-api-reference)
- [Performance](#-performance)
- [Contributing](#-contributing)

## 🎓 Core Concepts

### Word Severity Levels

Profanity Guard classifies words into four severity levels:

| Severity | Description | Examples | Use Case |
|----------|-------------|----------|----------|
| **MILD** | Minor profanity, generally acceptable in casual contexts | damn, hell, crap | Family-friendly apps with some tolerance |
| **MODERATE** | Common profanity, inappropriate in most public contexts | shit, ass, bitch | Standard content moderation |
| **SEVERE** | Strong profanity and slurs, offensive in virtually all contexts | fuck, and various slurs | Strict professional environments |
| **WTF** | Extreme profanity, hate speech, always blocked | Extreme content | Zero-tolerance policies |

### Moderation Modes

| Mode | Blocks | Best For |
|------|--------|----------|
| **OFF** | Nothing | Testing, admin panels |
| **RELAXED** | SEVERE + WTF | Adult-oriented platforms |
| **MODERATE** | MODERATE + SEVERE + WTF | General social media, forums |
| **STRICT** | ALL levels | Children's apps, professional platforms |

## 📖 Usage Guide

### Creating a Moderator

```typescript
import { ProfanityGuard, ModerationLevel } from '@useverse/profanity-guard';

// Default settings (MODERATE level, '*' censor)
const moderator = new ProfanityGuard();

// Custom moderation level
const strictModerator = new ProfanityGuard(ModerationLevel.STRICT);

// Custom censor character
const hashModerator = new ProfanityGuard(ModerationLevel.MODERATE, '#');

// Relaxed for adult content
const relaxedModerator = new ProfanityGuard(ModerationLevel.RELAXED);

// Turn off moderation (for admin/testing)
const offModerator = new ProfanityGuard(ModerationLevel.OFF);
```

### Moderation Levels

| Level | Description | Blocks |
|-------|-------------|--------|
| `OFF` | No moderation | Nothing |
| `RELAXED` | Minimal filtering | SEVERE, WTF |
| `MODERATE` | Standard filtering (default) | MODERATE, SEVERE, WTF |
| `STRICT` | Maximum filtering | MILD, MODERATE, SEVERE, WTF |

### Basic Operations

```typescript
// Quick clean check
if (moderator.isClean(userInput)) {
  console.log("Content is safe!");
}

// Sanitize content
const clean = moderator.sanitize("This damn thing is shit");
// Output: "This **** thing is ****"

// Get detailed results
const result = moderator.moderate(userInput);
if (!result.isClean) {
  console.log(`Found ${result.foundWords.length} profane words`);
  console.log(`Severity: ${result.severity}`);
}
```

### Using Alternatives

Replace profanity with appropriate alternatives instead of censoring:

```typescript
const result = moderator.moderateSentence(
  "This damn thing is awesome",
  true // preserveStructure
);

console.log(result.sanitized);
// Output: "This darn thing is awesome"
```

### Custom Word Library

```typescript
import { WordSeverity } from '@useverse/profanity-guard';

// Add individual words
moderator.addWord('badword', WordSeverity.MODERATE, ['goodword']);

// Add multiple words
moderator.addWords([
  { word: 'word1', severity: WordSeverity.MILD, alternatives: ['alt1'] },
  { word: 'word2', severity: WordSeverity.SEVERE }
]);

// Remove a word
moderator.removeWord('damn');

// Import from JSON
import customWords from './my-words.json';
moderator.importLibrary(customWords);

// Export current library
const myLibrary = moderator.exportLibrary();
```

### Using Pre-filtered Libraries

```typescript
import { 
  all_bad_words,
  mild_bad_words,
  moderate_bad_words,
  severe_bad_words 
} from 'nobadword/core/library';

// Import only severe words
const moderator = new NoBadWord();
moderator.clearLibrary(); // Remove defaults
moderator.importLibrary(severe_bad_words);
```

### Library Statistics

```typescript
const stats = moderator.getStats();
console.log(`Total: ${stats.total}`);
console.log(`Mild: ${stats.mild}`);
console.log(`Moderate: ${stats.moderate}`);
console.log(`Severe: ${stats.severe}`);
```

### Quick Moderate (One-off Use)

```typescript
import { quickModerate, ModerationLevel } from 'nobadword';

const result = quickModerate("Some text", ModerationLevel.STRICT);
```

## 🎯 Advanced Features

### Obfuscation Detection

NoBadWord automatically detects common character substitutions:

```typescript
moderator.isClean("sh!t");    // false - detects ! as i
moderator.isClean("d@mn");    // false - detects @ as a
moderator.isClean("f**k");    // false - detects asterisks
moderator.isClean("b-a-d");   // false - detects spacing
```

Supported substitutions:
- `a` → `@`, `4`
- `e` → `3`
- `i` → `1`, `!`, `|`
- `o` → `0`
- `s` → `$`, `5`
- And more...

### Content Analysis Utilities

#### Profanity Scoring
```typescript
const score = moderator.getProfanityScore("This damn text");
// Returns 0-100 based on severity and frequency

const isAcceptable = moderator.isWithinThreshold(content, 20);
// Check if score is within acceptable range
```

#### Detailed Analysis
```typescript
const report = moderator.getDetailedReport("This damn shit is bad");
console.log(report);
// {
//   isClean: false,
//   totalWords: 5,
//   profaneWords: 2,
//   profanityPercentage: 40,
//   score: 35,
//   highestSeverity: 'moderate',
//   severityCounts: { mild: 1, moderate: 1, severe: 0, wtf: 0 },
//   flaggedWords: ['damn', 'shit'],
//   details: [...]
// }
```

#### Content Validation
```typescript
const validation = moderator.validate("Content to check", {
  maxProfanityScore: 20,
  maxSeverity: WordSeverity.MILD,
  maxProfaneWords: 1
});

if (!validation.isValid) {
  console.log(validation.reasons); // Why validation failed
}
```

### Content Manipulation Utilities

#### Highlighting
```typescript
const highlighted = moderator.highlight("This damn text is shit");
// Output: "This <mark>damn</mark> text is <mark>shit</mark>"

// Custom tags
const custom = moderator.highlight(
  content,
  '<span class="flagged">',
  '</span>'
);
```

#### Alternative Replacements
```typescript
const replaced = moderator.replaceWithAlternatives("This damn thing");
// Output: "This darn thing" or "This dang thing" (random from alternatives)
```

#### Extract Clean Content
```typescript
const text = "Hello world. This is damn bad. Nice day.";
const clean = moderator.getCleanSentences(text);
// Output: ["Hello world", "Nice day"]
```

### Batch Processing

```typescript
// Process multiple items
const results = moderator.moderateBatch([
  "Hello world",
  "This is damn bad",
  "Nice day"
]);

// Filter arrays
const cleanOnly = moderator.filterClean(allComments);
const profaneOnly = moderator.filterProfane(allComments);
```

### Library Inspection

```typescript
// Check if word exists
if (moderator.hasWord('damn')) {
  const info = moderator.getWordInfo('damn');
  console.log(info.severity); // 'mild'
  console.log(info.alternatives); // ['darn', 'dang']
}

// Get suggestions
const suggestions = moderator.getSuggestions('damn');
// Output: ['darn', 'dang']

// Get words by severity
const mildWords = moderator.getWordsBySeverity(WordSeverity.MILD);
```

### Quick Utilities (No Instance Required)

For one-off operations without creating a moderator instance:

```typescript
import { 
  quickCheck,
  quickSanitize, 
  quickScore,
  quickValidate 
} from 'nobadword';

// Quick checks
if (quickCheck("Hello world")) {
  console.log("Clean!");
}

// Quick sanitization
const clean = quickSanitize("This damn text");

// Quick scoring
const score = quickScore("This is bad");

// Quick validation
const isValid = quickValidate(content, {
  maxProfanityScore: 20,
  maxSeverity: WordSeverity.MILD
});
```

> **Note:** Quick utilities are convenient but less efficient for repeated use. For better performance with multiple operations, create a NoBadWord instance and reuse it.

### Match Details

Get precise information about each detected word:

```typescript
const result = moderator.moderate("This damn text has shit");

result.matches.forEach(match => {
  console.log(`Word: "${match.word}"`);
  console.log(`Severity: ${match.severity}`);
  console.log(`Position: ${match.position}`);
});
```

### Dynamic Moderation Level

```typescript
// Start with relaxed moderation
moderator.setModerationLevel(ModerationLevel.RELAXED);

// Switch to strict for sensitive content
moderator.setModerationLevel(ModerationLevel.STRICT);

// Check current level
const level = moderator.getModerationLevel();
```

## 🔧 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { 
  NoBadWord,
  ModerationLevel,
  WordSeverity,
  ModerationResult,
  WordEntry,
  Match
} from 'nobadword';

const moderator: NoBadWord = new NoBadWord();
const result: ModerationResult = moderator.moderate("text");
const entry: WordEntry = {
  word: "example",
  severity: WordSeverity.MODERATE,
  alternatives: ["alt"]
};
```

## 📚 API Reference

### NoBadWord Class

#### Constructor
```typescript
new NoBadWord(moderationLevel?: ModerationLevel, censorChar?: string)
```

#### Core Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `moderate(content)` | Full moderation with details | `ModerationResult` |
| `isClean(content)` | Quick clean check | `boolean` |
| `sanitize(content)` | Get censored content | `string` |
| `moderateSentence(sentence, preserveStructure?)` | Moderate with alternatives | `ModerationResult` |

#### Analysis Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `getProfanityScore(content)` | Calculate profanity score (0-100) | `number` |
| `isWithinThreshold(content, threshold)` | Check if score within limit | `boolean` |
| `countBySeverity(content)` | Count words by severity | `Object` |
| `getDetailedReport(content)` | Comprehensive analysis report | `Object` |
| `validate(content, options)` | Validate against criteria | `Object` |

#### Manipulation Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `highlight(content, openTag?, closeTag?)` | Wrap profanity in tags | `string` |
| `replaceWithAlternatives(content)` | Replace with random alternatives | `string` |
| `getCleanSentences(content, delimiter?)` | Extract clean sentences | `string[]` |

#### Batch Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `moderateBatch(contents)` | Moderate multiple items | `ModerationResult[]` |
| `filterClean(contents)` | Filter to clean items only | `string[]` |
| `filterProfane(contents)` | Filter to profane items only | `string[]` |

#### Library Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `addWord(word, severity, alternatives?)` | Add single word | `void` |
| `addWords(entries)` | Add multiple words | `void` |
| `removeWord(word)` | Remove a word | `boolean` |
| `hasWord(word)` | Check if word exists | `boolean` |
| `getWordInfo(word)` | Get word details | `WordEntry \| null` |
| `getSuggestions(word)` | Get alternatives for word | `string[]` |
| `getWordsBySeverity(severity)` | Get all words by severity | `WordEntry[]` |
| `importLibrary(jsonData)` | Import word list | `void` |
| `exportLibrary()` | Export word list | `WordEntry[]` |
| `clearLibrary()` | Clear all words | `void` |
| `setModerationLevel(level)` | Change moderation level | `void` |
| `getModerationLevel()` | Get current level | `ModerationLevel` |
| `getStats()` | Get library statistics | `LibraryStats` |

### Quick Utility Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `quickModerate(content, level?)` | One-off moderation | `ModerationResult` |
| `quickCheck(content, level?)` | Quick clean check | `boolean` |
| `quickSanitize(content, level?, char?)` | Quick sanitization | `string` |
| `quickScore(content, level?)` | Quick profanity score | `number` |
| `quickValidate(content, options)` | Quick validation | `boolean` |

### Types

#### ModerationResult
```typescript
{
  isClean: boolean;
  foundWords: string[];
  severity: WordSeverity | null;
  sanitized: string;
  matches: Match[];
}
```

#### WordEntry
```typescript
{
  word: string;
  severity: WordSeverity;
  alternatives?: string[];
}
```

#### Match
```typescript
{
  word: string;
  severity: WordSeverity;
  position: number;
}
```

## 🎨 Use Cases

### Comment Moderation
```typescript
function moderateComment(comment: string): string {
  const moderator = new NoBadWord(ModerationLevel.MODERATE);
  const result = moderator.moderate(comment);
  
  if (!result.isClean) {
    logModerationEvent(result);
  }
  
  return result.sanitized;
}
```

### Chat Filter
```typescript
function filterChatMessage(message: string): { allowed: boolean; filtered: string } {
  const moderator = new NoBadWord(ModerationLevel.STRICT);
  const result = moderator.moderateSentence(message, true);
  
  return {
    allowed: result.severity !== 'severe',
    filtered: result.sanitized
  };
}
```

### User-Generated Content
```typescript
function validateUsername(username: string): { valid: boolean; reason?: string } {
  const moderator = new NoBadWord(ModerationLevel.STRICT);
  
  if (!moderator.isClean(username)) {
    return { valid: false, reason: 'Username contains inappropriate language' };
  }
  
  return { valid: true };
}
```

## ⚛️ React Hooks

Profanity Guard provides a comprehensive set of React hooks for seamless integration into React applications.

### useProfanityGuard

Main hook for content moderation with full access to all moderation features.

```tsx
import { useProfanityGuard, ModerationLevel } from '@useverse/profanity-guard';

function CommentSection() {
  const [comment, setComment] = useState('');
  const { moderate, sanitize, isClean, addWord } = useProfanityGuard({
    level: ModerationLevel.MODERATE,
    censorChar: '*'
  });
  
  const result = moderate(comment);
  
  const handleSubmit = () => {
    if (result.isClean) {
      // Submit comment
      submitComment(comment);
    } else {
      alert(`Please remove: ${result.foundWords.join(', ')}`);
    }
  };
  
  return (
    <div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} />
      <div className={result.isClean ? 'clean' : 'flagged'}>
        {result.isClean ? '✓ Clean' : `⚠️ Found: ${result.foundWords.join(', ')}`}
      </div>
      <button onClick={handleSubmit} disabled={!result.isClean}>
        Post Comment
      </button>
    </div>
  );
}
```

### useModeratedInput

Real-time input moderation with built-in state management.

```tsx
import { useModeratedInput, ModerationLevel } from '@useverse/profanity-guard';

function ChatInput() {
  const {
    content,
    setContent,
    result,
    sanitizedContent,
    isClean,
    foundWords,
    severity
  } = useModeratedInput('', {
    level: ModerationLevel.STRICT
  });
  
  return (
    <div className="chat-input">
      <input
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Type your message..."
        className={isClean ? '' : 'has-profanity'}
      />
      
      {!isClean && (
        <div className="warning">
          <span>⚠️ Contains: {foundWords.join(', ')}</span>
          <span className="severity-badge">{severity}</span>
        </div>
      )}
      
      <div className="preview">
        Preview: {sanitizedContent}
      </div>
      
      <button disabled={!isClean}>Send</button>
    </div>
  );
}
```

### useBatchModeration

Batch processing for lists of content.

```tsx
import { useBatchModeration } from '@useverse/profanity-guard';

function CommentList({ comments }) {
  const { moderateBatch, filterClean, filterProfane } = useBatchModeration({
    level: ModerationLevel.MODERATE
  });
  
  const results = moderateBatch(comments);
  const cleanComments = filterClean(comments);
  const flaggedComments = filterProfane(comments);
  
  return (
    <div>
      <h3>Clean Comments ({cleanComments.length})</h3>
      {cleanComments.map((comment, i) => (
        <div key={i} className="comment clean">{comment}</div>
      ))}
      
      <h3>Flagged Comments ({flaggedComments.length})</h3>
      {flaggedComments.map((comment, i) => (
        <div key={i} className="comment flagged">
          {results[comments.indexOf(comment)].sanitized}
        </div>
      ))}
    </div>
  );
}
```

### useProfanityValidation

Form validation with profanity checking.

```tsx
import { useProfanityValidation } from '@useverse/profanity-guard';

function SignupForm() {
  const [formData, setFormData] = useState({ username: '', bio: '' });
  const { validateField, errors, hasErrors, clearError } = useProfanityValidation({
    level: ModerationLevel.STRICT
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const usernameValid = validateField('username', formData.username);
    const bioValid = validateField('bio', formData.bio);
    
    if (usernameValid && bioValid) {
      // Submit form
      console.log('Form is valid!');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          value={formData.username}
          onChange={e => {
            setFormData({...formData, username: e.target.value});
            clearError('username');
          }}
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>
      
      <div>
        <label>Bio</label>
        <textarea
          value={formData.bio}
          onChange={e => {
            setFormData({...formData, bio: e.target.value});
            clearError('bio');
          }}
        />
        {errors.bio && <span className="error">{errors.bio}</span>}
      </div>
      
      <button type="submit" disabled={hasErrors}>
        Sign Up
      </button>
    </form>
  );
}
```

### useLiveSanitizer

Debounced live sanitization for performance.

```tsx
import { useLiveSanitizer } from '@useverse/profanity-guard';

function LiveEditor() {
  const { content, setContent, sanitized, isProcessing } = useLiveSanitizer(300, {
    level: ModerationLevel.MODERATE
  });
  
  return (
    <div className="editor">
      <div className="input-section">
        <label>Your Content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type here..."
        />
        {isProcessing && <span className="processing">Processing...</span>}
      </div>
      
      <div className="preview-section">
        <label>Sanitized Preview</label>
        <div className="preview">{sanitized}</div>
      </div>
    </div>
  );
}
```

### useProfanityStats

Analytics and statistics tracking.

```tsx
import { useProfanityStats } from '@useverse/profanity-guard';

function ModerationDashboard() {
  const { stats, analyzeContent, history, clearHistory } = useProfanityStats({
    level: ModerationLevel.MODERATE
  });
  
  return (
    <div className="dashboard">
      <h2>Moderation Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Analyzed</h3>
          <p className="stat-number">{stats.analyzed.total}</p>
        </div>
        
        <div className="stat-card">
          <h3>Flagged Content</h3>
          <p className="stat-number">{stats.analyzed.flagged}</p>
          <p className="stat-percent">{stats.analyzed.flaggedPercentage.toFixed(1)}%</p>
        </div>
        
        <div className="stat-card">
          <h3>Clean Content</h3>
          <p className="stat-number">{stats.analyzed.clean}</p>
        </div>
      </div>
      
      <div className="library-stats">
        <h3>Word Library</h3>
        <ul>
          <li>Total Words: {stats.library.total}</li>
          <li>Mild: {stats.library.mild}</li>
          <li>Moderate: {stats.library.moderate}</li>
          <li>Severe: {stats.library.severe}</li>
          <li>WTF: {stats.library.wtf}</li>
        </ul>
      </div>
      
      <button onClick={clearHistory}>Clear History</button>
    </div>
  );
}
```

### useContentReplacement

Smart word replacement with alternatives.

```tsx
import { useContentReplacement } from '@useverse/profanity-guard';

function SmartEditor() {
  const [text, setText] = useState('');
  const { replaceWithAlternatives, getSuggestions, getWordInfo } = useContentReplacement({
    level: ModerationLevel.MODERATE
  });
  
  const handleAutoFix = () => {
    const cleaned = replaceWithAlternatives(text);
    setText(cleaned);
  };
  
  const handleWordClick = (word) => {
    const suggestions = getSuggestions(word);
    const info = getWordInfo(word);
    
    if (suggestions.length > 0) {
      // Show suggestions modal
      showSuggestionsModal(word, suggestions, info);
    }
  };
  
  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAutoFix}>Auto-Fix Profanity</button>
    </div>
  );
}
```

## 🌍 Real-World Use Cases

### 1. Social Media Platform

```tsx
// Complete comment moderation system
import { useProfanityGuard, useModeratedInput } from '@useverse/profanity-guard';

function SocialMediaPost() {
  const {
    content,
    setContent,
    result,
    sanitizedContent,
    isClean
  } = useModeratedInput('', {
    level: ModerationLevel.MODERATE
  });
  
  const [showWarning, setShowWarning] = useState(false);
  
  const handlePost = async () => {
    if (!isClean) {
      setShowWarning(true);
      return;
    }
    
    await api.createPost({ content });
    setContent('');
  };
  
  return (
    <div className="post-creator">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind?"
        maxLength={280}
      />
      
      {showWarning && !isClean && (
        <div className="warning-banner">
          <p>Your post contains inappropriate language: {result.foundWords.join(', ')}</p>
          <p>Sanitized version: {sanitizedContent}</p>
          <button onClick={() => setContent(sanitizedContent)}>
            Use Sanitized Version
          </button>
        </div>
      )}
      
      <div className="post-footer">
        <span className={isClean ? 'status-ok' : 'status-warning'}>
          {isClean ? '✓ Ready to post' : '⚠️ Contains profanity'}
        </span>
        <button onClick={handlePost} disabled={!isClean}>
          Post
        </button>
      </div>
    </div>
  );
}
```

### 2. Live Chat Application

```tsx
// Real-time chat with moderation
import { useModeratedInput, useBatchModeration } from '@useverse/profanity-guard';

function ChatRoom({ messages }) {
  const { content, setContent, isClean, sanitizedContent } = useModeratedInput('', {
    level: ModerationLevel.STRICT
  });
  
  const { filterClean } = useBatchModeration({
    level: ModerationLevel.STRICT
  });
  
  const [chatHistory, setChatHistory] = useState(messages);
  
  const sendMessage = () => {
    if (isClean) {
      const newMessage = { text: content, user: currentUser, timestamp: Date.now() };
      setChatHistory([...chatHistory, newMessage]);
      setContent('');
    } else {
      // Auto-sanitize and send
      const newMessage = { text: sanitizedContent, user: currentUser, timestamp: Date.now() };
      setChatHistory([...chatHistory, newMessage]);
      setContent('');
    }
  };
  
  return (
    <div className="chat-room">
      <div className="messages">
        {chatHistory.map((msg, i) => (
          <div key={i} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
```

### 3. User Profile Management

```tsx
// Profile creation with validation
import { useProfanityValidation } from '@useverse/profanity-guard';

function ProfileEditor({ initialProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const { validateField, errors, hasErrors } = useProfanityValidation({
    level: ModerationLevel.STRICT
  });
  
  const handleSave = async () => {
    const fields = ['username', 'displayName', 'bio', 'location'];
    const validations = fields.map(field => validateField(field, profile[field]));
    
    if (validations.every(v => v)) {
      await api.updateProfile(profile);
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Please fix the errors before saving');
    }
  };
  
  return (
    <div className="profile-editor">
      <h2>Edit Profile</h2>
      
      <div className="form-group">
        <label>Username</label>
        <input
          value={profile.username}
          onChange={e => setProfile({...profile, username: e.target.value})}
          onBlur={() => validateField('username', profile.username)}
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>
      
      <div className="form-group">
        <label>Display Name</label>
        <input
          value={profile.displayName}
          onChange={e => setProfile({...profile, displayName: e.target.value})}
          onBlur={() => validateField('displayName', profile.displayName)}
        />
        {errors.displayName && <span className="error">{errors.displayName}</span>}
      </div>
      
      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={profile.bio}
          onChange={e => setProfile({...profile, bio: e.target.value})}
          onBlur={() => validateField('bio', profile.bio)}
          maxLength={500}
        />
        {errors.bio && <span className="error">{errors.bio}</span>}
      </div>
      
      <button onClick={handleSave} disabled={hasErrors}>
        Save Profile
      </button>
    </div>
  );
}
```

### 4. Content Moderation Dashboard

```tsx
// Admin moderation dashboard
import { useProfanityStats, useBatchModeration } from '@useverse/profanity-guard';

function ModerationPanel({ reportedContent }) {
  const { stats, analyzeContent } = useProfanityStats({
    level: ModerationLevel.MODERATE
  });
  
  const { moderateBatch } = useBatchModeration({
    level: ModerationLevel.MODERATE
  });
  
  const [selectedLevel, setSelectedLevel] = useState(ModerationLevel.MODERATE);
  const results = moderateBatch(reportedContent.map(r => r.content));
  
  const handleBulkAction = (action) => {
    const flaggedItems = results
      .map((result, index) => ({ result, item: reportedContent[index] }))
      .filter(({ result }) => !result.isClean);
    
    if (action === 'approve') {
      flaggedItems.forEach(({ item }) => approveContent(item.id));
    } else if (action === 'reject') {
      flaggedItems.forEach(({ item }) => rejectContent(item.id));
    }
  };
  
  return (
    <div className="moderation-panel">
      <div className="stats-header">
        <h2>Moderation Dashboard</h2>
        <div className="stats-summary">
          <div>Total Analyzed: {stats.analyzed.total}</div>
          <div>Flagged: {stats.analyzed.flagged} ({stats.analyzed.flaggedPercentage.toFixed(1)}%)</div>
          <div>Clean: {stats.analyzed.clean}</div>
        </div>
      </div>
      
      <div className="controls">
        <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}>
          <option value={ModerationLevel.RELAXED}>Relaxed</option>
          <option value={ModerationLevel.MODERATE}>Moderate</option>
          <option value={ModerationLevel.STRICT}>Strict</option>
        </select>
        
        <button onClick={() => handleBulkAction('approve')}>Approve All Clean</button>
        <button onClick={() => handleBulkAction('reject')}>Reject All Flagged</button>
      </div>
      
      <div className="content-list">
        {results.map((result, index) => (
          <div key={index} className={`content-item ${result.isClean ? 'clean' : 'flagged'}`}>
            <div className="content-text">{reportedContent[index].content}</div>
            <div className="content-meta">
              <span className="status">{result.isClean ? '✓ Clean' : '⚠️ Flagged'}</span>
              {!result.isClean && (
                <>
                  <span className="severity">{result.severity}</span>
                  <span className="words">Found: {result.foundWords.join(', ')}</span>
                </>
              )}
            </div>
            <div className="sanitized">Sanitized: {result.sanitized}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. E-commerce Product Reviews

```tsx
// Product review submission with moderation
import { useModeratedInput, useProfanityGuard } from '@useverse/profanity-guard';

function ProductReview({ productId }) {
  const {
    content: reviewText,
    setContent: setReviewText,
    isClean,
    sanitizedContent,
    severity
  } = useModeratedInput('', {
    level: ModerationLevel.MODERATE
  });
  
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async () => {
    if (!isClean && severity === 'severe') {
      alert('Your review contains inappropriate language and cannot be submitted.');
      return;
    }
    
    const finalReview = isClean ? reviewText : sanitizedContent;
    
    await api.submitReview({
      productId,
      rating,
      text: finalReview,
      flagged: !isClean
    });
    
    setSubmitted(true);
  };
  
  return (
    <div className="review-form">
      <h3>Write a Review</h3>
      
      <div className="rating-selector">
        <label>Rating:</label>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={rating >= star ? 'star-filled' : 'star-empty'}
          >
            ★
          </button>
        ))}
      </div>
      
      <div className="review-input">
        <label>Your Review:</label>
        <textarea
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          placeholder="Share your experience..."
          rows={6}
        />
        
        {!isClean && (
          <div className="moderation-notice">
            <p className="warning">
              ⚠️ Your review contains language that may be inappropriate.
            </p>
            {severity !== 'severe' && (
              <p className="info">
                We'll sanitize it automatically: "{sanitizedContent}"
              </p>
            )}
          </div>
        )}
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={!reviewText || (severity === 'severe')}
      >
        Submit Review
      </button>
      
      {submitted && (
        <div className="success-message">
          ✓ Thank you for your review!
          {!isClean && ' (Your review was moderated for appropriate language)'}
        </div>
      )}
    </div>
  );
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Your Name]

## 🔗 Links

- [Documentation](https://github.com/yourusername/nobadword#readme)
- [NPM Package](https://www.npmjs.com/package/nobadword)
- [Issue Tracker](https://github.com/yourusername/nobadword/issues)

## ⚠️ Disclaimer

This library provides content moderation capabilities but should not be the only line of defense in production applications. Always combine automated moderation with:
- Human review for borderline cases
- Context-aware moderation logic
- Regular library updates
- User reporting systems
- Community guidelines

## 🌟 Support

If you find this library helpful, please consider giving it a star on GitHub!
