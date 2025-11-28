# @useverse/useShortcuts

A flexible and type-safe React hook to register and handle keyboard shortcuts using the `keydown` event.

Supports modifier keys (Ctrl, Alt, Shift, Meta), conditional enabling/disabling, and custom dependency tracking.

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

import useShortcuts from '@useverse/useshortcuts';

export default function KeyboardShortcutDemo() {
  const handleShortcut = (shortcut) => {
    console.log('Shortcut triggered:', shortcut);
  };

  useShortcuts({
    shortcuts: [
      { key: 'K', ctrlKey: true },
      { key: 'K', metaKey: true },
      { key: 'S', ctrlKey: true, shiftKey: true },
      { key: 'F5', isSpecialKey: true }
    ],
    onTrigger: handleShortcut
  }, [handleShortcut]);

  return <p>Try pressing Ctrl+K, Ctrl+Shift+S or F5!</p>;
}
```

### With Dependencies

```tsx
import { useState } from 'react';
import useShortcuts from '@useverse/useshortcuts';

export default function SaveDocument() {
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log('Saving:', content);
    // Save logic here
  };

  // Re-run shortcut handler when handleSave or content changes
  useShortcuts({
    shortcuts: [
      { key: 'S', ctrlKey: true },
      { key: 'S', metaKey: true }
    ],
    onTrigger: handleSave
  }, [handleSave, content]);

  return (
    <textarea 
      value={content} 
      onChange={(e) => setContent(e.target.value)}
      placeholder="Press Ctrl+S to save"
    />
  );
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
      { key: 'S', ctrlKey: true, enabled: canEdit },
      { key: 'Z', ctrlKey: true, enabled: canUndo },
      { key: 'H', ctrlKey: true } // always enabled
    ],
    onTrigger: (shortcut) => {
      if (shortcut.key === 'S') console.log('Save');
      if (shortcut.key === 'Z') console.log('Undo');
      if (shortcut.key === 'H') console.log('Help');
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

| Property       | Type      | Required | Default | Description                                                |
| -------------- | --------- | -------- | ------- | ---------------------------------------------------------- |
| `key`          | `string`  | ✅        | —       | Keyboard key to listen for (e.g. `'K'`, `'F5'`).           |
| `ctrlKey`      | `boolean` | ❌        | —       | Require the Ctrl key to be held.                           |
| `altKey`       | `boolean` | ❌        | —       | Require the Alt key to be held.                            |
| `shiftKey`     | `boolean` | ❌        | —       | Require the Shift key to be held.                          |
| `metaKey`      | `boolean` | ❌        | —       | Require the Meta (Cmd ⌘ on Mac, Windows key) key.          |
| `isSpecialKey` | `boolean` | ❌        | `false` | Whether the key is a special key like `F5`, `Escape`, etc. |
| `enabled`      | `boolean` | ❌        | `true`  | Whether this shortcut is active. Use to conditionally disable shortcuts. |

### ShortcutOptions

| Property    | Type                 | Required | Description                                    |
| ----------- | -------------------- | -------- | ---------------------------------------------- |
| `shortcuts` | `ShortcutConfig[]`   | ✅        | List of shortcut keys with optional modifiers. |
| `onTrigger` | `(shortcut) => void` | ✅        | Callback fired when a shortcut is matched.     |

### Dependencies

| Parameter | Type              | Required | Default | Description                                                |
| --------- | ----------------- | -------- | ------- | ---------------------------------------------------------- |
| `deps`    | `DependencyList`  | ❌        | `[]`    | Dependency array (like `useEffect`) to control when the shortcut handler re-runs. |

---

## 🧩 Features

* ✅ Multiple key combinations supported
* ⌨️ Modifier key handling (Ctrl, Alt, Shift, Meta)
* 🧠 Intelligent fallback if modifier keys are not specified
* 🎯 `isSpecialKey` support for keys like `F1`–`F12`, `Escape`, etc.
* 🔄 Cleans up listeners automatically on unmount
* 🎛️ Conditional shortcuts with `enabled` property
* 📦 Dependency tracking like `useEffect` for optimal performance

---

## 🧪 Example Use Cases

* Open modals with `Ctrl + M`
* Trigger save with `Ctrl + S` (only when editing is enabled)
* Toggle theme with `Cmd + T`
* Handle F-keys or Escape as actions
* Conditionally enable shortcuts based on user permissions or app state
* Undo/redo with `Ctrl + Z` / `Ctrl + Y` (only when history is available)

---

## 📝 License

MIT