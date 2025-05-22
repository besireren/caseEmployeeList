import { getLocale, setLocale } from './locales/index.js';
import { store } from './store.js';

// Utility function to get current language (used throughout the app)
export function getCurrentLanguage() {
    return getLocale() || localStorage.getItem('lang') || document.documentElement.lang || 'tr';
}

// Initialize application
async function init() {
    try {
        // Get initial locale
        const initialLocale = getCurrentLanguage();
        document.documentElement.lang = initialLocale;
        
        // Set locale for translations
        await setLocale(initialLocale);

        // Load components dynamically
        await Promise.all([
            import('./components/app-root.js'),
            import('./components/employee-list.js'),
            import('./components/employee-form.js')
        ]);

        // Create app root if it doesn't exist
        if (!document.querySelector('app-root')) {
            const appRoot = document.createElement('app-root');
            (document.getElementById('app-container') || document.body).appendChild(appRoot);
        }
    } catch (error) {
        // In production, we would log this to a monitoring service
        if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to initialize application:', error);
        }
    }
}

// Start the application
init(); 