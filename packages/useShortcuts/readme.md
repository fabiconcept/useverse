# @useverse/useShortcuts

A powerful, type-safe React hook for handling keyboard shortcuts with automatic cross-platform support, intelligent key detection, and zero configuration.

---

## ✨ Features

* 🎯 **TypeScript autocomplete** - Get suggestions for all keyboard keys without importing enums
* 🖥️ **Platform Aware shortcuts** - Automatically swap Ctrl/Cmd based on platform
* 🤖 **Automatic key detection** - No need to specify `isSpecialKey` - the hook figures it out
* ⌨️ **Full modifier support** - Ctrl, Alt, Shift, Meta (Cmd)
* 🔄 **Conditional shortcuts** - Enable/disable based on app state
* 📦 **Lightweight** - Zero dependencies, minimal bundle size
* 🚀 **Ready-to-use presets** - Common shortcuts like Save, Copy, Paste included
* 🛡️ **Automatic cleanup** - Event listeners removed on unmount
* 🌍 **Platform detection** - `isMacOS()` utility included

---

## 📦 Installation

```bash
npm install @useverse/useshortcuts
```

---

## 🚀 Quick Start

```tsx
"use client";

import useShortcuts, { ShortcutsPresets } from '@useverse/useshortcuts';

export default function MyEditor() {
  useShortcuts({
    shortcuts: [
      ShortcutsPresets.SAVE(),    // Works on all platforms!
      ShortcutsPresets.COPY(),
      {
        key: 'K',                 // ← TypeScript suggests all valid keys
        ctrlKey: true,
        enabled: true,
        platformAware: true,       // Auto-converts to Cmd on Mac
      }
    ],
    onTrigger: (shortcut) => {
      console.log('Triggered:', shortcut.key);
    }
  });

  return <div>Press Ctrl/Cmd + S to save</div>;
}
```

---

## 📖 Usage Examples

### Basic Shortcuts

```tsx
import useShortcuts from '@useverse/useshortcuts';

export default function Editor() {
  useShortcuts({
    shortcuts: [
      { key: 'S', ctrlKey: true, enabled: true },
      { key: 'K', ctrlKey: true, enabled: true },
      { key: 'Enter', enabled: true },
      { key: 'Escape', enabled: true }
    ],
    onTrigger: (shortcut) => {
      console.log('Key pressed:', shortcut.key);
    }
  });

  return <textarea placeholder="Try Ctrl+S or Ctrl+K" />;
}
```

### Using Presets (Recommended)

```tsx
"use client";
import { useState, useCallback } from 'react';
import useShortcuts, { ShortcutsPresets } from '@useverse/useshortcuts';

export default function SaveDocument() {
  const [content, setContent] = useState('');

  const handleShortcut = useCallback((shortcut) => {
    switch (shortcut.key) {
      case 'S':
        console.log('Saving:', content);
        break;
      case 'Z':
        if (shortcut.shiftKey) {
          console.log('Redo');
        } else {
          console.log('Undo');
        }
        break;
    }
  }, [content]);

  useShortcuts({
    shortcuts: [
      ShortcutsPresets.SAVE(),    // Ctrl+S (Windows) / Cmd+S (Mac)
      ShortcutsPresets.UNDO(),    // Ctrl+Z (Windows) / Cmd+Z (Mac)
      ShortcutsPresets.REDO(),    // Ctrl+Shift+Z (Windows) / Cmd+Shift+Z (Mac)
    ],
    onTrigger: handleShortcut
  }, [handleShortcut]);

  return (
    <textarea 
      value={content} 
      onChange={(e) => setContent(e.target.value)}
      placeholder="Press Ctrl/Cmd+S to save"
    />
  );
}
```

### Platform Aware Shortcuts

```tsx
import useShortcuts from '@useverse/useshortcuts';

export default function App() {
  useShortcuts({
    shortcuts: [
      {
        key: 'S',
        ctrlKey: true,
        enabled: true,
        platformAware: true,  // ← Becomes Cmd+S on Mac automatically!
      },
      {
        key: 'N',
        metaKey: true,
        enabled: true,
        platformAware: true,  // ← Becomes Ctrl+N on Windows automatically!
      }
    ],
    onTrigger: (shortcut) => {
      console.log('Triggered:', shortcut.key);
    }
  });

  return <div>Cross-platform shortcuts that just work!</div>;
}
```

### Conditional Shortcuts

```tsx
import { useState } from 'react';
import useShortcuts from '@useverse/useshortcuts';

export default function Editor() {
  const [canEdit, setCanEdit] = useState(true);
  const [canUndo, setCanUndo] = useState(false);

  useShortcuts({
    shortcuts: [
      { 
        key: 'S', 
        ctrlKey: true, 
        enabled: canEdit,       // ← Only active when editing
        platformAware: true 
      },
      { 
        key: 'Z', 
        ctrlKey: true, 
        enabled: canUndo,       // ← Only active when undo available
        platformAware: true 
      },
    ],
    onTrigger: (shortcut) => {
      if (shortcut.key === 'S') saveDocument();
      if (shortcut.key === 'Z') undoLastChange();
    }
  }, [canEdit, canUndo]);

  return (
    <div>
      <button onClick={() => setCanEdit(!canEdit)}>
        Toggle Edit Mode ({canEdit ? 'ON' : 'OFF'})
      </button>
    </div>
  );
}
```

### Using KeyboardKey Enum (Optional)

```tsx
import useShortcuts, { KeyboardKey } from '@useverse/useshortcuts';

export default function App() {
  useShortcuts({
    shortcuts: [
      { key: KeyboardKey.KeyK, ctrlKey: true, enabled: true },
      { key: KeyboardKey.Enter, enabled: true },
      { key: KeyboardKey.ArrowUp, shiftKey: true, enabled: true },
    ],
    onTrigger: (shortcut) => {
      console.log('Pressed:', shortcut.key);
    }
  });

  return <div>Keyboard shortcuts demo</div>;
}
```

### Displaying Platform-Specific Hints

```tsx
import { isMacOS } from '@useverse/useshortcuts';

export default function ShortcutReference() {
  const isMac = isMacOS();
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <div>
      <h3>Keyboard Shortcuts</h3>
      <table>
        <tbody>
          <tr>
            <td>Save:</td>
            <td><kbd>{modKey}</kbd> + <kbd>S</kbd></td>
          </tr>
          <tr>
            <td>Copy:</td>
            <td><kbd>{modKey}</kbd> + <kbd>C</kbd></td>
          </tr>
          <tr>
            <td>Paste:</td>
            <td><kbd>{modKey}</kbd> + <kbd>V</kbd></td>
          </tr>
          <tr>
            <td>Undo:</td>
            <td><kbd>{modKey}</kbd> + <kbd>Z</kbd></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

---

## ⚙️ API Reference

### Hook Signature

```typescript
useShortcuts(
  options: ShortcutOptions,
  deps?: DependencyList
): void
```

### ShortcutConfig

| Property       | Type      | Required | Default | Description                                                           |
| -------------- | --------- | -------- | ------- | --------------------------------------------------------------------- |
| `key`          | `string`  | ✅        | —       | Keyboard key: letter (A-Z), digit (Digit0-9), or special key (Enter) |
| `enabled`      | `boolean` | ✅        | —       | Whether this shortcut is active                                       |
| `platformAware` | `boolean` | ❌        | `false` | Auto-swap Ctrl↔Cmd based on platform                                  |
| `ctrlKey`      | `boolean` | ❌        | —       | Require Ctrl key (becomes Cmd on Mac if platformAware=true)           |
| `altKey`       | `boolean` | ❌        | —       | Require Alt key                                                       |
| `shiftKey`     | `boolean` | ❌        | —       | Require Shift key                                                     |
| `metaKey`      | `boolean` | ❌        | —       | Require Meta/Cmd key (becomes Ctrl on Windows if platformAware=true)  |

### ShortcutOptions

| Property    | Type                                 | Required | Description                                |
| ----------- | ------------------------------------ | -------- | ------------------------------------------ |
| `shortcuts` | `ShortcutConfig[]`                   | ✅        | Array of shortcut configurations           |
| `onTrigger` | `(shortcut: ShortcutConfig) => void` | ✅        | Callback fired when a shortcut is matched  |

### Dependencies

| Parameter | Type             | Required | Default | Description                                          |
| --------- | ---------------- | -------- | ------- | ---------------------------------------------------- |
| `deps`    | `DependencyList` | ❌        | `[]`    | Dependency array to control when handler re-runs     |

---

## 🎹 Key Types

The hook supports all standard keyboard keys with automatic detection:

### Letters
`'A'` through `'Z'` - Just use single letters!

### Digits  
`'Digit0'` through `'Digit9'`

### Special Keys
`'Enter'`, `'Escape'`, `'Space'`, `'Tab'`, `'Backspace'`, `'Delete'`, `'CapsLock'`, `'PrintScreen'`, `'Insert'`, `'Pause'`

### Navigation
`'Home'`, `'End'`, `'PageUp'`, `'PageDown'`

### Arrows
`'ArrowUp'`, `'ArrowDown'`, `'ArrowLeft'`, `'ArrowRight'`

### Function Keys
`'F1'` through `'F12'`

### Special Characters
`'Slash'`, `'Comma'`, `'Period'`, `'Semicolon'`, `'Quote'`, `'BackQuote'`, `'Minus'`, `'Equal'`, `'BracketLeft'`, `'BracketRight'`, `'Backslash'`

### Lock Keys
`'NumLock'`, `'ScrollLock'`

**TypeScript provides autocomplete for all these keys!**

---

## 🎁 Built-in Presets

All presets have `platformAware: true` enabled by default:

```typescript
ShortcutsPresets.SAVE(enabled?: boolean)       // Ctrl/Cmd + S
ShortcutsPresets.COPY(enabled?: boolean)       // Ctrl/Cmd + C
ShortcutsPresets.PASTE(enabled?: boolean)      // Ctrl/Cmd + V
ShortcutsPresets.UNDO(enabled?: boolean)       // Ctrl/Cmd + Z
ShortcutsPresets.REDO(enabled?: boolean)       // Ctrl/Cmd + Shift + Z
ShortcutsPresets.SELECT_ALL(enabled?: boolean) // Ctrl/Cmd + A
ShortcutsPresets.CLOSE(enabled?: boolean)      // Ctrl/Cmd + W
ShortcutsPresets.OPEN(enabled?: boolean)       // Ctrl/Cmd + O
```

---

## 🖥️ Platform Aware Mode

When `platformAware: true` is set:

**On macOS:**
- `ctrlKey: true` → becomes `metaKey: true` (Cmd)

**On Windows/Linux:**
- `metaKey: true` → becomes `ctrlKey: true` (Ctrl)

This allows you to write shortcuts once that work naturally on all platforms:

**Type Safety:** When `platformAware: true`, TypeScript prevents you from specifying both `ctrlKey` and `metaKey` simultaneously, since the hook handles the conversion automatically.
```tsx
// ✅ Valid
{ key: 'S', ctrlKey: true, platformAware: true }

// ❌ TypeScript error
{ key: 'S', ctrlKey: true, metaKey: true, platformAware: true }

```tsx
// Define once
{ key: 'S', ctrlKey: true, platformAware: true }

// Automatically becomes:
// - Cmd+S on Mac
// - Ctrl+S on Windows/Linux
```

---

## 🛠️ Utility Functions

### `isMacOS()`

Detects if the current platform is macOS.

```typescript
import { isMacOS } from '@useverse/useshortcuts';

const isMac = isMacOS();
// Returns: true on macOS, false on Windows/Linux/iOS/iPadOS
```

**Detection strategy:**
1. Checks `navigator.platform` (primary, most reliable)
2. Falls back to `navigator.userAgent` check
3. Explicitly excludes iOS/iPadOS devices
4. Returns `false` for SSR (no window/navigator)

---

## 🧩 Advanced Examples

### Multiple Modifier Keys

```tsx
useShortcuts({
  shortcuts: [
    {
      key: 'S',
      ctrlKey: true,
      shiftKey: true,
      altKey: true,
      enabled: true,
      platformAware: true,  // Works with multiple modifiers
    }
  ],
  onTrigger: () => console.log('Ctrl+Shift+Alt+S pressed!')
});
```

### Complex Conditional Logic

```tsx
const [isEditing, setIsEditing] = useState(false);
const [hasChanges, setHasChanges] = useState(false);
const [canSave, setCanSave] = useState(false);

useShortcuts({
  shortcuts: [
    { 
      key: 'E', 
      ctrlKey: true, 
      enabled: !isEditing,
      platformAware: true 
    },
    { 
      key: 'Escape', 
      enabled: isEditing 
    },
    { 
      key: 'S', 
      ctrlKey: true, 
      enabled: isEditing && hasChanges && canSave,
      platformAware: true 
    },
  ],
  onTrigger: (shortcut) => {
    if (shortcut.key === 'E') setIsEditing(true);
    if (shortcut.key === 'Escape') setIsEditing(false);
    if (shortcut.key === 'S') saveDocument();
  }
}, [isEditing, hasChanges, canSave]);
```

---

## 🧪 Example Use Cases

* ✅ Save documents with Ctrl/Cmd+S (only when editing is enabled)
* ✅ Open command palette with Ctrl/Cmd+K
* ✅ Toggle theme with Ctrl/Cmd+T
* ✅ Navigate with arrow keys or function keys
* ✅ Undo/redo with Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z (only when history exists)
* ✅ Close modals with Escape
* ✅ Conditionally enable shortcuts based on permissions or app state
* ✅ Cross-platform shortcuts that automatically adapt to Mac/Windows/Linux

---

## 📝 Notes

* **No `isSpecialKey` needed** - The hook automatically detects letter keys vs other keys
* **Modifier keys are optional** - Undefined modifiers match any state
* **Automatic preventDefault** - Matched shortcuts prevent default browser behavior
* **TypeScript autocomplete** - Get suggestions for all valid keys without importing enums
* **SSR-safe** - Works with Next.js and other SSR frameworks
* **Zero dependencies** - Lightweight and fast

---

## 🆚 Migration from v3.0.2 to v4.0.0

### Before (v3.0.2)
```tsx
{ 
  key: KeyboardKey.KeyS,  // Required enum import
  ctrlKey: true,
  isSpecialKey: false,    // Had to specify this
  enabled: true 
}
```

### After (v4.0.0)
```tsx
{ 
  key: 'S',              // String literal with autocomplete
  ctrlKey: true,
  platformAware: true,    // New: auto Ctrl/Cmd swap
  enabled: true 
}
// No isSpecialKey needed - automatic detection!
```

---

## 📄 License

MIT [LICENSE](../../LICENCE)