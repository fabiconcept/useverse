# @useverse/core

A comprehensive collection of practical React hooks designed to enhance web applications with sound effects, keyboard shortcuts, and file download capabilities.

[![npm version](https://img.shields.io/npm/v/@useverse/core)](https://www.npmjs.com/package/@useverse/core)
[![license](https://img.shields.io/npm/l/@useverse/core)](https://github.com/fabiconcept/useverse/blob/main/LICENSE)

## Features

This core package bundles all useverse hooks into a single, convenient package:

- 🎵 **useSoundEffect** - Add UI sound effects to interactive elements
- ⌨️ **useShortcuts** - Implement keyboard shortcuts and hotkeys
- 📥 **useFileDownload** - Handle file downloads with status tracking

## Installation

```bash
npm install @useverse/core
# or
yarn add @useverse/core
# or
pnpm add @useverse/core
```

## Quick Start

```jsx
import { useSoundEffect, useShortcuts, useFileDownload } from '@useverse/core';

function FileManager() {
  // Configure sound effects for different actions
  const hoverSound = useSoundEffect('/hover.mp3', { volume: 0.3 });
  const clickSound = useSoundEffect('/click.mp3', { volume: 0.5 });
  const successSound = useSoundEffect('/success.mp3', { volume: 0.7 });
  const errorSound = useSoundEffect('/error.mp3', { volume: 0.7 });
  
  // Manage downloads with status tracking
  const [downloadStatus, startDownload] = useFileDownload();
  
  // Define keyboard shortcuts for file operations
  useShortcuts({
    shortcuts: [
      { key: 's', ctrlKey: true, shiftKey: true },  // Ctrl+Shift+S
      { key: 'd', ctrlKey: true },                  // Ctrl+D
      { key: 'Escape' },                            // Esc
    ],
    onTrigger: (shortcut) => {
      if (shortcut.key === 's' && shortcut.ctrlKey && shortcut.shiftKey) {
        handleSaveAll();
      } else if (shortcut.key === 'd' && shortcut.ctrlKey) {
        handleDownload();
      } else if (shortcut.key === 'Escape') {
        handleCancel();
      }
    }
  });

  // File operation handlers
  const handleDownload = async () => {
    clickSound();
    try {
      await startDownload('https://example.com/report.pdf', 'quarterly-report.pdf');
      successSound();
    } catch {
      errorSound();
    }
  };

  return (
    <div className="file-manager">
      <div className="toolbar">
        <button
          onMouseEnter={hoverSound}
          onClick={handleDownload}
          disabled={downloadStatus === 'downloading'}
        >
          {downloadStatus === 'downloading' ? 'Downloading...' : 'Download Report'}
        </button>
        
        <div className="status">
          {downloadStatus === 'success' && (
            <span className="success">✓ Download complete!</span>
          )}
          {downloadStatus === 'error' && (
            <span className="error">⚠ Download failed</span>
          )}
        </div>
      </div>

      <div className="shortcuts-help">
        <h4>Keyboard Shortcuts</h4>
        <ul>
          <li>Ctrl + Shift + S: Save all files</li>
          <li>Ctrl + D: Download report</li>
          <li>Esc: Cancel operation</li>
        </ul>
      </div>
    </div>
  );
}
```

## Requirements

- React >=16.8.0 (Hooks support)
- Modern browser environment

## Individual Packages

If you prefer to use hooks individually, you can install them separately:

- [@useverse/useSoundEffect](https://www.npmjs.com/package/@useverse/usesoundeffect)
- [@useverse/useShortcuts](https://www.npmjs.com/package/@useverse/useshortcuts)
- [@useverse/useFileDownload](https://www.npmjs.com/package/@useverse/usefiledownload)

## Documentation

For detailed documentation of each hook, visit their respective package pages:

- [useSoundEffect Documentation](https://github.com/fabiconcept/useverse/tree/main/packages/useSoundEffect#readme)
- [useShortcuts Documentation](https://github.com/fabiconcept/useverse/tree/main/packages/useShortcuts#readme)
- [useFileDownload Documentation](https://github.com/fabiconcept/useverse/tree/main/packages/useFileDownload#readme)

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/fabiconcept/useverse/blob/main/CONTRIBUTING.md) for details.

## License

ISC © [fabiconcept](https://github.com/fabiconcept)
