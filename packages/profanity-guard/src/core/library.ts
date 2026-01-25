/**
 * Word Library Module
 * 
 * @module core/library
 * @description Comprehensive word library for content moderation with severity classifications
 * 
 * @remarks
 * This library uses lazy loading to minimize bundle size. Word lists are only loaded when needed.
 * The library is expandable and should be customized based on your specific needs using:
 * - {@link ProfanityGuard.addWord}
 * - {@link ProfanityGuard.addWords}
 * - {@link ProfanityGuard.importLibrary}
 */

import { WordEntry, WordSeverity } from "../type";

/**
 * Lazy load MILD severity words
 * @returns {WordEntry[]} Array of mild severity words
 */
export function loadMildWords(): WordEntry[] {
    const data = require("../data/mild.json");
    return data.map((w: any) => ({
        ...w,
        severity: w.severity as WordSeverity
    }));
}

/**
 * Lazy load MODERATE severity words
 * @returns {WordEntry[]} Array of moderate severity words
 */
export function loadModerateWords(): WordEntry[] {
    const data = require("../data/moderate.json");
    return data.map((w: any) => ({
        ...w,
        severity: w.severity as WordSeverity
    }));
}

/**
 * Lazy load SEVERE severity words
 * @returns {WordEntry[]} Array of severe severity words
 */
export function loadSevereWords(): WordEntry[] {
    const data = require("../data/severe.json");
    return data.map((w: any) => ({
        ...w,
        severity: w.severity as WordSeverity
    }));
}

/**
 * Lazy load WTF severity words
 * @returns {WordEntry[]} Array of WTF severity words
 */
export function loadWtfWords(): WordEntry[] {
    const data = require("../data/wtf.json");
    return data.map((w: any) => ({
        ...w,
        severity: w.severity as WordSeverity
    }));
}

/**
 * Lazy load complete word library (all severity levels)
 * @returns {WordEntry[]} Complete word library
 */
export function loadAllWords(): WordEntry[] {
    const data = require("../data/words.json");
    return data.map((w: any) => ({
        ...w,
        severity: w.severity as WordSeverity
    }));
}

/**
 * Legacy exports for backward compatibility
 * @deprecated Use lazy loading functions instead for better bundle size
 */
export const mild_bad_words = loadMildWords();
export const moderate_bad_words = loadModerateWords();
export const severe_bad_words = loadSevereWords();
export const wtf_bad_words = loadWtfWords();
export const all_bad_words = loadAllWords();