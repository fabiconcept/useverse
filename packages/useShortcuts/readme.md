# @useverse/useShortcuts

A flexible and type-safe React hook for handling keyboard shortcuts with support for modifier keys, conditional enabling, and custom dependency tracking.

---

## 📦 Installation

```bash
npm install @useverse/useshortcuts
```

---

## 🚀 Usage

### Basic Example

```tsx
"use client";

import useShortcuts, { KeyboardKey } from '@useverse/useshortcuts';

export default function KeyboardShortcutDemo() {
  const handleShortcut = (shortcut) => {
    console.log('Shortcut triggered:', shortcut);
  };

  useShortcuts({
    shortcuts: [
      { key: KeyboardKey.KeyK, ctrlKey: true, enabled: true },
      { key: KeyboardKey.KeyK, metaKey: true, enabled: true },
      { key: KeyboardKey.KeyS, ctrlKey: true, shiftKey: true, enabled: true },
      { key: KeyboardKey.F5, isSpecialKey: true, enabled: true }
    ],
    onTrigger: handleShortcut
  }, [handleShortcut]);

  return <p>Try pressing Ctrl+K, Cmd+K, Ctrl+Shift+S or F5!</p>;
}
```

### Using Shortcuts Presets

```tsx
"use client";
import { useState, useCallback } from 'react';
import useShortcuts, { ShortcutsPresets, KeyboardKey } from '@useverse/useshortcuts';

export default function SaveDocument() {
  const [content, setContent] = useState('');

  const handleShortcut = useCallback((shortcut: KeyboardKey) => {
    if (shortcut.key === 'S') {
      console.log('Saving:', content);
      // Save logic here
    }
  }, [content]);

  useShortcuts({
    shortcuts: [
      ShortcutsPresets.SAVE(),
      ShortcutsPresets.UNDO(),
      ShortcutsPresets.REDO()
    ],
    onTrigger: handleShortcut
  }, [handleShortcut]);

  return (
    <textarea 
      value={content} 
      onChange={(e) => setContent(e.target.value)}
      placeholder="Press Ctrl+S to save, Ctrl+Z to undo"
    />
  );
}
```

### Conditional Shortcuts

```tsx
import { useState } from 'react';
import useShortcuts, { KeyboardKey } from '@useverse/useshortcuts';

export default function Editor() {
  const [canEdit, setCanEdit] = useState(true);
  const [canUndo, setCanUndo] = useState(false);

  useShortcuts({
    shortcuts: [
      { key: KeyboardKey.KeyS, ctrlKey: true, enabled: canEdit },
      { key: KeyboardKey.KeyZ, ctrlKey: true, enabled: canUndo },
      { key: KeyboardKey.KeyH, ctrlKey: true, enabled: true }
    ],
    onTrigger: (shortcut) => {
      if (shortcut.key === KeyboardKey.KeyS) console.log('Save');
      if (shortcut.key === KeyboardKey.KeyZ) console.log('Undo');
      if (shortcut.key === KeyboardKey.KeyH) console.log('Help');
    }
  }, [canEdit, canUndo]);

  return (
    <div>
      <button onClick={() => setCanEdit(!canEdit)}>
        Toggle Edit Mode
      </button>
      <p>Edit mode: {canEdit ? 'ON' : 'OFF'}</p>
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

| Property       | Type               | Required | Default | Description                                                |
| -------------- | ------------------ | -------- | ------- | ---------------------------------------------------------- |
| `key`          | `KeyboardKey`      | ✅        | —       | Keyboard key from the `KeyboardKey` enum.                  |
| `ctrlKey`      | `boolean`          | ❌        | —       | Require the Ctrl key to be held.                           |
| `altKey`       | `boolean`          | ❌        | —       | Require the Alt key to be held.                            |
| `shiftKey`     | `boolean`          | ❌        | —       | Require the Shift key to be held.                          |
| `metaKey`      | `boolean`          | ❌        | —       | Require the Meta (Cmd ⌘ on Mac, Windows key) to be held.  |
| `isSpecialKey` | `boolean`          | ❌        | `false` | Set to `true` for special keys like F1-F12, Escape, etc.   |
| `enabled`      | `boolean`          | ✅        | —       | Whether this shortcut is active. Required field.           |

### ShortcutOptions

| Property    | Type                               | Required | Description                                    |
| ----------- | ---------------------------------- | -------- | ---------------------------------------------- |
| `shortcuts` | `ShortcutConfig[]`                 | ✅        | Array of shortcut configurations.              |
| `onTrigger` | `(shortcut: ShortcutConfig) => void` | ✅      | Callback fired when a shortcut is matched.     |

### Dependencies

| Parameter | Type              | Required | Default | Description                                                |
| --------- | ----------------- | -------- | ------- | ---------------------------------------------------------- |
| `deps`    | `DependencyList`  | ❌        | `[]`    | Dependency array to control when the shortcut handler re-runs. |

### KeyboardKey Enum

Use the `KeyboardKey` enum for type-safe key definitions:

```typescript
// Letter keys
KeyboardKey.KeyA through KeyboardKey.KeyZ

// Number keys
KeyboardKey.Digit0 through KeyboardKey.Digit9

// Special keys
KeyboardKey.Enter, KeyboardKey.Escape, KeyboardKey.Space, 
KeyboardKey.Backspace, KeyboardKey.Delete, KeyboardKey.Tab

// Arrow keys
KeyboardKey.ArrowUp, KeyboardKey.ArrowDown, 
KeyboardKey.ArrowLeft, KeyboardKey.ArrowRight

// Function keys
KeyboardKey.F1 through KeyboardKey.F12

// And more...
```

### Shortcuts Presets

Pre-configured common shortcuts:

```typescript
ShortcutsPresets.SAVE(enabled?: boolean)      // Ctrl+S
ShortcutsPresets.COPY(enabled?: boolean)      // Ctrl+C
ShortcutsPresets.PASTE(enabled?: boolean)     // Ctrl+V
ShortcutsPresets.UNDO(enabled?: boolean)      // Ctrl+Z
ShortcutsPresets.REDO(enabled?: boolean)      // Ctrl+Shift+Z
ShortcutsPresets.SELECT_ALL(enabled?: boolean) // Ctrl+A
ShortcutsPresets.CLOSE(enabled?: boolean)     // Ctrl+W
ShortcutsPresets.OPEN(enabled?: boolean)      // Ctrl+O
```

---

## 🧩 Features

* ✅ Type-safe keyboard key definitions with enums
* ⌨️ Full modifier key support (Ctrl, Alt, Shift, Meta)
* 🎯 Special key handling (F1–F12, Escape, Arrow keys, etc.)
* 🔄 Automatic event listener cleanup on unmount
* 🎛️ Conditional shortcuts with `enabled` property
* 📦 Dependency tracking for optimal performance
* 🚀 Pre-configured common shortcuts via `ShortcutsPresets`
* 🛡️ Prevents default browser behavior when shortcuts match

---

## 🧪 Example Use Cases

* Save documents with Ctrl+S (only when editing is enabled)
* Open command palette with Ctrl+K or Cmd+K
* Toggle theme with Ctrl+T
* Navigate with arrow keys or F-keys
* Undo/redo with Ctrl+Z/Ctrl+Shift+Z (only when history exists)
* Close modals with Escape
* Conditionally enable shortcuts based on user permissions or app state

---

## 📝 Notes

* All shortcuts require the `enabled` property to be explicitly set
* Modifier keys (ctrl, alt, shift, meta) are optional and default to undefined (any state matches)
* Use `isSpecialKey: true` for non-alphanumeric keys like F5, Escape, Enter, etc.
* The hook automatically prevents default browser behavior when a shortcut matches
* Use the dependency array to control when shortcut handlers should update

---

## 📄 License

MIT