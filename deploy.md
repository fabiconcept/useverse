# 📦 NPM Publishing Guide

A step-by-step guide to publishing your package to NPM.

---

## 🔐 Prerequisites

Before publishing, ensure:

- [ ] You have an NPM account ([Sign up here](https://www.npmjs.com/signup))
- [ ] Package name is available on NPM
- [ ] `package.json` is properly configured
- [ ] Code is tested and ready for release
- [ ] README and documentation are up to date

---

## 📋 Publishing Steps

### 1. Login to NPM

```bash
npm login
```

Enter your NPM credentials when prompted.

**Verify login:**
```bash
npm whoami
```

---

### 2. Pre-publish Checks

**Check package contents:**
```bash
npm pack --dry-run
```

This shows what files will be included in your package.

**Test the package locally:**
```bash
npm link
cd ../test-project
npm link @useverse/useshortcuts
```

---

### 3. Update Version

```bash
# For bug fixes
npm version patch

# For new features (backwards compatible)
npm version minor

# For breaking changes
npm version major
```

This will:
- Update `package.json` version
- Create a git commit
- Create a git tag

---

### 4. Build the Package (important)

If your package requires compilation:

```bash
npm run build
```

Make sure your build output is included in the package via `package.json`:

```json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

---

### 5. Publish to NPM

**For scoped packages (first time):**
```bash
npm publish --access public
```

**For subsequent publishes:**
```bash
npm publish
```

---

### 6. Verify Publication

```bash
npm view @useverse/useshortcuts
```

Check the NPM registry:
- Visit `https://www.npmjs.com/package/@useverse/useshortcuts`
- Verify version number
- Check package contents

## 🚀 Automated Publishing Workflow


**Usage:**
```bash
npm run release:patch
```

---

## 🔗 Useful Commands

```bash
# View package info
npm view @useverse/useshortcuts

# View all versions
npm view @useverse/useshortcuts versions

# View latest version
npm view @useverse/useshortcuts version

# Unpublish a version (within 72 hours)
npm unpublish @useverse/useshortcuts@1.0.0

# Deprecate a version
npm deprecate @useverse/useshortcuts@1.0.0 "Use version 2.0.0 instead"

# Check outdated packages
npm outdated
```