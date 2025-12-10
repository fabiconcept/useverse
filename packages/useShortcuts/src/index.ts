import { useEffect, useCallback, DependencyList } from 'react';

enum KeyboardKey {
    Backspace = 'Backspace',
    Tab = 'Tab',
    Enter = 'Enter',
    Pause = 'Pause',
    CapsLock = 'CapsLock',
    Escape = 'Escape',
    Space = 'Space',
    PageUp = 'PageUp',
    PageDown = 'PageDown',
    End = 'End',
    Home = 'Home',
    ArrowLeft = 'ArrowLeft',
    ArrowUp = 'ArrowUp',
    ArrowRight = 'ArrowRight',
    ArrowDown = 'ArrowDown',
    PrintScreen = 'PrintScreen',
    Insert = 'Insert',
    Delete = 'Delete',
    
    F1 = 'F1',
    F2 = 'F2',
    F3 = 'F3',
    F4 = 'F4',
    F5 = 'F5',
    F6 = 'F6',
    F7 = 'F7',
    F8 = 'F8',
    F9 = 'F9',
    F10 = 'F10',
    F11 = 'F11',
    F12 = 'F12',

    NumLock = 'NumLock',
    ScrollLock = 'ScrollLock',

    // Letter keys
    KeyA = 'A',
    KeyB = 'B',
    KeyC = 'C',
    KeyD = 'D',
    KeyE = 'E',
    KeyF = 'F',
    KeyG = 'G',
    KeyH = 'H',
    KeyI = 'I',
    KeyJ = 'J',
    KeyK = 'K',
    KeyL = 'L',
    KeyM = 'M',
    KeyN = 'N',
    KeyO = 'O',
    KeyP = 'P',
    KeyQ = 'Q',
    KeyR = 'R',
    KeyS = 'S',
    KeyT = 'T',
    KeyU = 'U',
    KeyV = 'V',
    KeyW = 'W',
    KeyX = 'X',
    KeyY = 'Y',
    KeyZ = 'Z',

    // Number keys
    Digit0 = 'Digit0',
    Digit1 = 'Digit1',
    Digit2 = 'Digit2',
    Digit3 = 'Digit3',
    Digit4 = 'Digit4',
    Digit5 = 'Digit5',
    Digit6 = 'Digit6',
    Digit7 = 'Digit7',
    Digit8 = 'Digit8',
    Digit9 = 'Digit9',

    // Special character keys
    Slash = 'Slash',
    Comma = 'Comma',
    Period = 'Period',
    Semicolon = 'Semicolon',
    Quote = 'Quote',
    BackQuote = 'BackQuote',
    Minus = 'Minus',
    Equal = 'Equal',
    BracketLeft = 'BracketLeft',
    BracketRight = 'BracketRight',
    Backslash = 'Backslash',
}

// Special keys that use event.key directly
type SpecialKey = 
    | KeyboardKey.Backspace
    | KeyboardKey.Tab
    | KeyboardKey.Enter
    | KeyboardKey.Pause
    | KeyboardKey.CapsLock
    | KeyboardKey.Escape
    | KeyboardKey.Space
    | KeyboardKey.PageUp
    | KeyboardKey.PageDown
    | KeyboardKey.End
    | KeyboardKey.Home
    | KeyboardKey.ArrowLeft
    | KeyboardKey.ArrowUp
    | KeyboardKey.ArrowRight
    | KeyboardKey.ArrowDown
    | KeyboardKey.PrintScreen
    | KeyboardKey.Insert
    | KeyboardKey.Delete
    | KeyboardKey.F1
    | KeyboardKey.F2
    | KeyboardKey.F3
    | KeyboardKey.F4
    | KeyboardKey.F5
    | KeyboardKey.F6
    | KeyboardKey.F7
    | KeyboardKey.F8
    | KeyboardKey.F9
    | KeyboardKey.F10
    | KeyboardKey.F11
    | KeyboardKey.F12
    | KeyboardKey.NumLock
    | KeyboardKey.ScrollLock
    | KeyboardKey.Slash
    | KeyboardKey.Comma
    | KeyboardKey.Period
    | KeyboardKey.Semicolon
    | KeyboardKey.Quote
    | KeyboardKey.BackQuote
    | KeyboardKey.Minus
    | KeyboardKey.Equal
    | KeyboardKey.BracketLeft
    | KeyboardKey.BracketRight
    | KeyboardKey.Backslash;

// Letter and digit keys that use event.code
type LetterKey = 
    | KeyboardKey.KeyA | KeyboardKey.KeyB | KeyboardKey.KeyC | KeyboardKey.KeyD
    | KeyboardKey.KeyE | KeyboardKey.KeyF | KeyboardKey.KeyG | KeyboardKey.KeyH
    | KeyboardKey.KeyI | KeyboardKey.KeyJ | KeyboardKey.KeyK | KeyboardKey.KeyL
    | KeyboardKey.KeyM | KeyboardKey.KeyN | KeyboardKey.KeyO | KeyboardKey.KeyP
    | KeyboardKey.KeyQ | KeyboardKey.KeyR | KeyboardKey.KeyS | KeyboardKey.KeyT
    | KeyboardKey.KeyU | KeyboardKey.KeyV | KeyboardKey.KeyW | KeyboardKey.KeyX
    | KeyboardKey.KeyY | KeyboardKey.KeyZ;

type DigitKey = 
    | KeyboardKey.Digit0 | KeyboardKey.Digit1 | KeyboardKey.Digit2
    | KeyboardKey.Digit3 | KeyboardKey.Digit4 | KeyboardKey.Digit5
    | KeyboardKey.Digit6 | KeyboardKey.Digit7 | KeyboardKey.Digit8
    | KeyboardKey.Digit9;

type LetterOrDigitKey = LetterKey | DigitKey;

// Base modifiers - optional for all shortcut types
type ModifierKeys = {
    ctrlKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    metaKey?: boolean;
};

// Discriminated union based on key type
type ShortcutConfig = ModifierKeys & {
    enabled: boolean;
} & (
    | {
        key: SpecialKey;
        isSpecialKey: true;
    }
    | {
        key: LetterOrDigitKey;
        isSpecialKey?: false; // Optional for letter/digit keys, defaults to false
    }
);

// Shortcuts Presets
const ShortcutsPresets: Record<string, (enabled?: boolean) => ShortcutConfig> = {
    SAVE: (enabled = true) => ({
        key: KeyboardKey.KeyS,
        ctrlKey: true,
        enabled,
    }),
    COPY: (enabled = true) => ({
        key: KeyboardKey.KeyC,
        ctrlKey: true,
        enabled,
    }),
    PASTE: (enabled = true) => ({
        key: KeyboardKey.KeyV,
        ctrlKey: true,
        enabled,
    }),
    UNDO: (enabled = true) => ({
        key: KeyboardKey.KeyZ,
        ctrlKey: true,
        enabled,
    }),
    REDO: (enabled = true) => ({
        key: KeyboardKey.KeyZ,
        ctrlKey: true,
        shiftKey: true,
        enabled,
    }),
    SELECT_ALL: (enabled = true) => ({
        key: KeyboardKey.KeyA,
        ctrlKey: true,
        enabled,
    }),
    CLOSE: (enabled = true) => ({
        key: KeyboardKey.KeyW,
        ctrlKey: true,
        enabled,
    }),
    OPEN: (enabled = true) => ({
        key: KeyboardKey.KeyO,
        ctrlKey: true,
        enabled,
    })
}

interface ShortcutOptions {
    shortcuts: ShortcutConfig[];
    onTrigger: (shortcut: ShortcutConfig) => void;
}

/**
 * Hook to register and handle keyboard shortcuts.
 *
 * @param {ShortcutOptions} options
 *   - `shortcuts`: array of shortcut configurations
 *   - `onTrigger`: callback invoked when a matching shortcut is pressed
 * @param {DependencyList} deps - dependency array to control when the effect re-runs
 */
const useShortcuts = ({ shortcuts, onTrigger }: ShortcutOptions, deps: DependencyList = []) => {
    const handleShortCut = useCallback((e: KeyboardEvent) => {
        const { ctrlKey, altKey, shiftKey, metaKey, code } = e;

        const matchingShortcut = shortcuts.find(shortcut => {
            // Skip disabled shortcuts
            if (!shortcut.enabled) return false;
            
            const keyMatch = shortcut.isSpecialKey 
                ? code === shortcut.key 
                : code === `Key${shortcut.key}`;
            const ctrlMatch = shortcut.ctrlKey === undefined || shortcut.ctrlKey === ctrlKey;
            const altMatch = shortcut.altKey === undefined || shortcut.altKey === altKey;
            const shiftMatch = shortcut.shiftKey === undefined || shortcut.shiftKey === shiftKey;
            const metaMatch = shortcut.metaKey === undefined || shortcut.metaKey === metaKey;

            return keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch;
        });

        if (matchingShortcut) {
            e.preventDefault();
            onTrigger(matchingShortcut);
        }
    }, deps);

    useEffect(() => {
        document.addEventListener("keydown", handleShortCut);
        return () => document.removeEventListener("keydown", handleShortCut);
    }, [handleShortCut]);
};

export default useShortcuts;
export { ShortcutsPresets, KeyboardKey  };