# @useverse/useSoundEffect

A powerful React hook to easily manage and play sound effects with options for autoplay, random intervals, volume control, and more.

Ideal for adding feedback sounds, ambient loops, or interactive audio to your UI.

---

## 📦 Installation

```bash
npm install @useverse/usesoundeffect
````

---

## 🚀 Usage

```tsx
"use client";

import useSoundEffect from '@useverse/usesoundeffect';

export default function ExampleComponent() {
  const {
    play,
    stop,
    startRandom,
    adjustVolume,
    isPlaying,
    currentVolume
  } = useSoundEffect('/sounds/notify.mp3', {
    volume: 0.7,
    autoplay: true,
    loop: false,
    playRandomly: false
  });

  return (
    <div>
      <button onClick={play}>Play Sound</button>
      <button onClick={stop}>Stop Sound</button>
      <button onClick={() => adjustVolume(0.3)}>Lower Volume</button>
      <p>Status: {isPlaying ? 'Playing' : 'Stopped'}</p>
      <p>Current Volume: {currentVolume}</p>
    </div>
  );
}
```

---

## ⚙️ Options

| Option         | Type      | Default | Description                                                                |
| -------------- | --------- | ------- | -------------------------------------------------------------------------- |
| `soundUrl`     | `string`  | —       | URL or path to the sound file (required).                                  |
| `volume`       | `number`  | `1`     | Initial volume (range: `0` to `1`).                                        |
| `preload`      | `boolean` | `true`  | Whether to preload the audio on mount.                                     |
| `loop`         | `boolean` | `false` | Whether the sound should loop when played.                                 |
| `autoplay`     | `boolean` | `false` | Automatically play the sound on mount.                                     |
| `playRandomly` | `boolean` | `false` | Automatically play the sound at random intervals.                          |
| `minInterval`  | `number`  | `5000`  | Minimum interval in ms between random plays (if `playRandomly` is `true`). |
| `maxInterval`  | `number`  | `15000` | Maximum interval in ms between random plays.                               |

---

## 🧩 Returned Methods

| Method           | Type                      | Description                                                              |
| ---------------- | ------------------------- | ------------------------------------------------------------------------ |
| `play()`         | `() => void`              | Plays the sound effect immediately.                                      |
| `stop()`         | `() => void`              | Stops the sound and resets the audio.                                    |
| `startRandom()`  | `() => void`              | Starts the sound effect at randomized intervals.                         |
| `adjustVolume()` | `(vol: number) => number` | Updates the volume (clamped between 0 and 1) and returns the new volume. |
| `isPlaying`      | `boolean`                 | Indicates if the sound is currently playing.                             |
| `currentVolume`  | `number`                  | Current volume value between 0 and 1.                                    |

---

## 🧠 Notes

* Random playback is only active while the component is mounted and `playRandomly` is true.
* `adjustVolume` updates both the internal state and the currently playing sound.
* This hook uses native `Audio` APIs, so it works without external dependencies.

---

## 🧪 Example Use Cases

* Notification sounds (e.g. success, error, messages)
* UI feedback clicks or hovers
* Ambient background effects (like rain, forest)
* Periodic reminders or alerts