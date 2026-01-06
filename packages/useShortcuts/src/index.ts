import { useEffect, useCallback, DependencyList } from 'react';

/**
 * Detects if the current platform is macOS.
 * Checks both navigator.platform and navigator.userAgent for reliability.
 * 
 * @returns {boolean} true if running on macOS, false otherwise
 */
const isMacOS = (): boolean => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    
    // Check platform first (most reliable)
    const platform = navigator.platform?.toLowerCase() || '';
    if (platform.startsWith('mac')) {
        return true;
    }
    
    // Fallback to userAgent check
    const userAgent = navigator.userAgent?.toLowerCase() || '';
    return userAgent.includes('mac') && !userAgent.includes('iphone') && !userAgent.includes('ipad');
};

// Define string literal types for better autocomplete
type SpecialKeyValue = 
    | 'Backspace' | 'Tab' | 'Enter' | 'Pause' | 'CapsLock' | 'Escape' 
    | 'Space' | 'PageUp' | 'PageDown' | 'End' | 'Home'
    | 'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown'
    | 'PrintScreen' | 'Insert' | 'Delete'
    | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12'
    | 'NumLock' | 'ScrollLock'
    | 'Slash' | 'Comma' | 'Period' | 'Semicolon' | 'Quote' | 'BackQuote'
    | 'Minus' | 'Equal' | 'BracketLeft' | 'BracketRight' | 'Backslash';

type LetterKeyValue = 
    | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
    | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

type DigitKeyValue = 
    | 'Digit0' | 'Digit1' | 'Digit2' | 'Digit3' | 'Digit4'
    | 'Digit5' | 'Digit6' | 'Digit7' | 'Digit8' | 'Digit9';

// Enum for convenience (optional to import)
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

// Base properties shared by all shortcut configs
type ShortcutConfigBase = {
    key: LetterKeyValue | DigitKeyValue | SpecialKeyValue;
    enabled: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
};

/**
 * Shortcut configuration with platform-aware type safety.
 * 
 * When platformAware is true, you can only specify EITHER ctrlKey OR metaKey (not both).
 * This prevents ambiguous configurations since the hook will automatically swap them based on OS.
 */
type ShortcutConfig = ShortcutConfigBase & (
    | {
        /**
         * When true with ctrlKey, automatically becomes metaKey on macOS.
         */
        platformAware: true;
        ctrlKey?: boolean;
        metaKey?: never; // ← TypeScript error if you try to use both
    }
    | {
        /**
         * When true with metaKey, automatically becomes ctrlKey on Windows/Linux.
         */
        platformAware: true;
        metaKey?: boolean;
        ctrlKey?: never; // ← TypeScript error if you try to use both
    }
    | {
        /**
         * When false or undefined, you can specify both keys manually for full control.
         */
        platformAware?: false;
        ctrlKey?: boolean;
        metaKey?: boolean;
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
            
            // Apply OS-responsive key swapping if enabled
            let expectedCtrl = shortcut.ctrlKey;
            let expectedMeta = shortcut.metaKey;
            
            if (shortcut.platformAware) {
                const isMac = isMacOS();
                
                if (isMac) {
                    // On Mac: Ctrl becomes Cmd (Meta)
                    if (shortcut.ctrlKey) {
                        expectedMeta = true;
                        expectedCtrl = undefined;
                    }
                } else {
                    // On Windows/Linux: Cmd (Meta) becomes Ctrl
                    if (shortcut.metaKey) {
                        expectedCtrl = true;
                        expectedMeta = undefined;
                    }
                }
            }
            
            // Automatically detect if it's a letter key (single character A-Z)
            const isLetterKey = shortcut.key.length === 1 && /^[A-Z]$/.test(shortcut.key);
            
            const keyMatch = isLetterKey 
                ? code === `Key${shortcut.key}`
                : code === shortcut.key;
                
            const ctrlMatch = expectedCtrl === undefined || expectedCtrl === ctrlKey;
            const altMatch = shortcut.altKey === undefined || shortcut.altKey === altKey;
            const shiftMatch = shortcut.shiftKey === undefined || shortcut.shiftKey === shiftKey;
            const metaMatch = expectedMeta === undefined || expectedMeta === metaKey;

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
export { ShortcutsPresets, KeyboardKey, isMacOS };
export type { ShortcutConfig, LetterKeyValue, DigitKeyValue, SpecialKeyValue };