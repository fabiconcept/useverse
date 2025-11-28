import { useEffect, useCallback, DependencyList } from 'react';

interface ShortcutConfig {
    key: string;
    ctrlKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    metaKey?: boolean;
    isSpecialKey?: boolean;
    enabled?: boolean;
}

interface ShortcutOptions {
    shortcuts: ShortcutConfig[];
    onTrigger: (shortcut: ShortcutConfig) => void;
}

/**
 * Hook to register and handle keyboard shortcuts.
 *
 * Listens for `keydown` events and triggers a callback when a matching shortcut is detected.
 *
 * @param {ShortcutOptions} options
 *   - `shortcuts`: array of shortcut configurations to match against
 *   - `onTrigger`: callback invoked when a matching shortcut is pressed
 * @param {DependencyList} deps - dependency array (like useEffect) to control when the effect re-runs
 */
const useShortcuts = ({ shortcuts, onTrigger }: ShortcutOptions, deps: DependencyList = []) => {
    const handleShortCut = useCallback((e: KeyboardEvent) => {
        const { ctrlKey, altKey, shiftKey, metaKey, code } = e;

        const matchingShortcut = shortcuts.find(shortcut => {
            // Skip disabled shortcuts
            if (shortcut.enabled === false) return false;
            
            const keyMatch = shortcut.isSpecialKey 
                ? code === shortcut.key 
                : code === `Key${shortcut.key.toUpperCase()}`;
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