# @useverse/useFileDownload

A React hook for downloading files from a URL with built-in status tracking. Automatically determines file names, handles content types, and provides real-time UI feedback.

---

## 📦 Installation

```bash
npm install @useverse/useFileDownload
````

---

## 🚀 Usage

```tsx
"use client";

import useFileDownload from '@useverse/useFileDownload';

export default function DownloadButton() {
  const [status, startDownload] = useFileDownload();

  const handleDownload = () => {
    startDownload('https://example.com/file.pdf', 'custom-name.pdf');
  };

  return (
    <div>
      <button onClick={handleDownload}>Download PDF</button>
      <p>Status: {status}</p>
    </div>
  );
}
```

---

## 📁 API

### `useFileDownload()`

Returns a tuple:

```ts
[
  status: DownloadStatus,
  startDownload: (url: string, customFilename?: string) => Promise<void>
]
```

### `DownloadStatus`

| Value           | Description                           |
| --------------- | ------------------------------------- |
| `'idle'`        | No download in progress               |
| `'downloading'` | File is currently downloading         |
| `'success'`     | Download completed successfully       |
| `'error'`       | An error occurred during the download |

---

## ⚙️ Options

#### `startDownload(url: string, customFilename?: string)`

| Parameter        | Type     | Required | Description                 |
| ---------------- | -------- | -------- | --------------------------- |
| `url`            | `string` | ✅        | URL of the file to download |
| `customFilename` | `string` | ❌        | Optional filename override  |

---

## 🧠 Features

* ✅ Type-safe and Promise-based download initiation
* 📄 Auto-detects and appends file extensions based on `Content-Type`
* 🧹 Automatically revokes object URLs and cleans up memory
* 🔄 Automatically resets status after 3 seconds
* 🧪 Hook + helper function structure for advanced use

---

## 🧰 Advanced Use

If you want just the logic to manually trigger a download:

```ts
import { downloadHandler } from '@useverse/useFileDownload';

await downloadHandler('https://example.com/image.png', 'custom-image.png');
```

---

## 📌 Notes

* Works in client-side environments (browser only).
* Handles both dynamic and static file URLs.
* Prevents duplicate download calls while one is in progress.
