# 🪝 useverse – The Universe of Custom React Hooks

Welcome to **useverse**, a modular, modern library of hand-crafted React hooks designed to solve practical, real-world problems – one hook at a time.

> 🚀 Install only what you need.  
> ✨ Every hook is its own package.  
> 🧠 Clear APIs, clean code, and real utility.

---

## 🌌 Why useverse?

- Modular – import just one hook without the bloat.
- Documented – each hook comes with clear TypeScript types and usage examples.
- Client-ready – designed for React apps with `"use client"` compatibility.
- Open-source – contribute your own hook ideas or improvements!

---

## 📦 Installation

Install any hook individually:

```bash
npm install @useverse/useFileDownload
````

Want everything?

```bash
npm install @useverse/core
```

---

## 🧰 Available Hooks

| Hook              | Description                                                                          | Install                     | Docs                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------- |
| `useSoundEffect`  | Play sound effects with options for volume, random intervals, looping, and autoplay. | `@useverse/useSoundEffect`  | [View README →](https://github.com/useverse/hooks/tree/main/packages/useSoundEffect)  |
| `useShortcuts`    | Bind custom keyboard shortcuts with modifiers like Ctrl, Alt, Shift, etc.            | `@useverse/useShortcuts`    | [View README →](https://github.com/useverse/hooks/tree/main/packages/useShortcuts)    |
| `useFileDownload` | Download files from a URL with auto-filename detection and status tracking.          | `@useverse/useFileDownload` | [View README →](https://github.com/useverse/hooks/tree/main/packages/useFileDownload) |

> 📌 More hooks coming soon...

---

## 🧑‍💻 Contributing

We welcome contributions! Whether it's a new hook, a fix, or improving documentation, you're welcome to help grow the **useverse**.

---

## 🛠 How to Contribute

Here's a step-by-step guide for beginners:

### 1. Fork the repo

Go to the [main repository](https://github.com/fabiconcept/useverse) and click `Fork`.

### 2. Clone your fork

```bash
git clone https://github.com/your-username/hooks.git
cd useverse
```

### 3. Install dependencies

```bash
npm install
```

### 4. Add your hook

Each hook lives in its own folder under `packages/`.
Use the template:

```bash
mkdir packages/useYourHook
cd packages/useYourHook
```

Create:

* `index.ts` – your hook code
* `README.md` – documentation with usage examples
* `package.json` – copy from another hook and update name, description

Example structure:

```
useYourHook/
├── index.ts
├── README.md
└── package.json
```

### 5. Link your package

Back in the root folder:

```bash
npx changeset
npx changeset version 
npx changeset publish 
```

Verify your new hook works as expected.

### 6. Commit your changes

```bash
git add .
git commit -m "Add useYourHook"
```

### 7. Push and open a PR

```bash
git push origin newHook/your-branch
```

Then open a Pull Request on GitHub. I’ll (hopefully We) review and merge!

---

## 🤝 Community Guidelines

* Respect the modularity of each hook.
* Write clear and minimal code – readability > cleverness.
* Document everything! README is required.
* Prefer TypeScript and React best practices.

---

## 🪐 License

MIT © [useverse contributors](https://github.com/fabiconcept/useverse)

---

### 💬 Questions? Ideas?

Open an [issue](https://github.com/fabiconcept/useverse/issues) or reach out – we'd love to hear from you.
