# @useverse/useShortcuts

A flexible and type-safe React hook to register and handle keyboard shortcuts using the `keydown` event.

Supports modifier keys (Ctrl, Alt, Shift, Meta) and custom actions when shortcuts are triggered.

---

## 📦 Installation

```bash
npm install @useverse/useShortcuts
````

---

## 🚀 Usage

```tsx
"use client";

import useShortcuts from '@useverse/useShortcuts';

export default function KeyboardShortcutDemo() {
  useShortcuts({
    shortcuts: [
      { key: 'K', ctrlKey: true },
      { key: 'S', ctrlKey: true, shiftKey: true },
      { key: 'F5', isSpecialKey: true }
    ],
    onTrigger: (shortcut) => {
      console.log('Shortcut triggered:', shortcut);
    }
  });

  return <p>Try pressing Ctrl+K, Ctrl+Shift+S or F5!</p>;
}
```

---

## ⚙️ Options

### ShortcutConfig

| Property       | Type      | Required | Default | Description                                                |
| -------------- | --------- | -------- | ------- | ---------------------------------------------------------- |
| `key`          | `string`  | ✅        | —       | Keyboard key to listen for (e.g. `'K'`, `'F5'`).           |
| `ctrlKey`      | `boolean` | ❌        | —       | Require the Ctrl key to be held.                           |
| `altKey`       | `boolean` | ❌        | —       | Require the Alt key to be held.                            |
| `shiftKey`     | `boolean` | ❌        | —       | Require the Shift key to be held.                          |
| `metaKey`      | `boolean` | ❌        | —       | Require the Meta (Cmd ⌘ on Mac, Windows key) key.          |
| `isSpecialKey` | `boolean` | ❌        | `false` | Whether the key is a special key like `F5`, `Escape`, etc. |

### ShortcutOptions

| Property    | Type                 | Required | Description                                    |
| ----------- | -------------------- | -------- | ---------------------------------------------- |
| `shortcuts` | `ShortcutConfig[]`   | ✅        | List of shortcut keys with optional modifiers. |
| `onTrigger` | `(shortcut) => void` | ✅        | Callback fired when a shortcut is matched.     |

---

## 🧩 Features

* ✅ Multiple key combinations supported
* ⌨️ Modifier key handling (Ctrl, Alt, Shift, Meta)
* 🧠 Intelligent fallback if modifier keys are not specified
* 🎯 `isSpecialKey` support for keys like `F1`–`F12`, `Escape`, etc.
* 🔄 Cleans up listeners automatically on unmount

---

## 🧪 Example Use Cases

* Open modals with `Ctrl + M`
* Trigger save with `Ctrl + S`
* Toggle theme with `Cmd + T`
* Handle F-keys or Escape as actions