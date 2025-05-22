// This module is responsible for loading locales and translation utilities
import { configureLocalization } from '@lit/localize';
import { en } from './en.js';
import { tr } from './tr.js';

// Templates object
const templates = {
    'en': en,
    'tr': tr
};

// Configure localization
export const { getLocale, setLocale } = configureLocalization({
    sourceLocale: 'en',
    targetLocales: ['tr'],
    loadLocale: async (locale) => {
        // Get templates
        const selectedTemplates = templates[locale] || templates['en'];
        return selectedTemplates;
    }
}); 