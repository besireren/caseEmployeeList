import { LitElement, css, html } from 'lit';
import { en } from '../locales/en.js';
import { tr } from '../locales/tr.js';

export class ConfirmationDialog extends LitElement {
    static properties = {
        open: { type: Boolean },
        message: { type: String },
        type: { type: String },
        translations: { type: Object, state: true },
        currentLanguage: { type: String, state: true }
    };

    static styles = css`
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
        }

        .overlay.open {
            opacity: 1;
            visibility: visible;
        }

        .dialog {
            background: white;
            border-radius: 4px;
            padding: 20px;
            width: 430px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            position: relative;
        }

        .title {
            color: var(--ing-orange, #FF6200);
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 8px;
            padding-right: 20px;
        }

        .close-button {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            padding: 0;
            color: var(--ing-orange, #FF6200);
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
        }

        .close-button:hover {
            opacity: 1;
        }

        .close-button svg {
            width: 28px;
            height: 28px;
            stroke: currentColor;
            stroke-width: 1.5;
        }

        .message {
            color: #666;
            margin-bottom: 20px;
            font-size: 14px;
            line-height: 1.4;
            padding-right: 24px;
        }

        .actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        button:not(.close-button) {
            width: 100%;
            padding: 14px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
        }

        .proceed {
            background: var(--ing-orange, #FF6200);
            color: white;
            border: none;
        }

        .proceed:hover {
            background: #e55800;
        }

        .cancel {
            background: white;
            color: #6366F1;
            border: 1px solid #E5E5E5;
        }

        .cancel:hover {
            border-color: #6366F1;
            background: white;
        }
    `;

    constructor() {
        super();
        this.open = false;
        this.message = '';
        this.type = 'delete';
        this.currentLanguage = document.documentElement.lang || 'tr';
        
        // Initialize translations
        this.translations = {
            'en': en,
            'tr': tr
        };
        
        // Bind methods
        this._handleLanguageChange = this._handleLanguageChange.bind(this);
    }
    
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('language-changed', this._handleLanguageChange);
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('language-changed', this._handleLanguageChange);
    }
    
    _handleLanguageChange(event) {
        this.currentLanguage = document.documentElement.lang || 'tr';
        this.requestUpdate();
    }

    // Get translation text based on current language
    t(key) {
        const lang = this.currentLanguage || document.documentElement.lang || 'tr';
        const translations = this.translations[lang] || this.translations['en'];
        return translations[key] || key;
    }

    close() {
        this.open = false;
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    proceed() {
        this.dispatchEvent(new CustomEvent('proceed'));
        this.open = false;
    }

    getButtonText() {
        switch (this.type) {
            case 'update':
                return this.t('form.submit.update');
            case 'add':
                return this.t('form.submit.add');
            case 'delete':
            default:
                return this.t('list.actions.delete');
        }
    }

    render() {
        if (!this.open) return null;

        return html`
            <div class="overlay ${this.open ? 'open' : ''}" @click=${this.close}>
                <div class="dialog" @click=${(e) => e.stopPropagation()}>
                    <h3 class="title">
                        ${this.type === 'delete' ? this.t('list.actions.delete') : 
                        this.type === 'update' ? this.t('form.submit.update') : 
                        this.t('form.submit.add')}
                    </h3>
                    <button class="close-button" @click=${this.close}>
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="message">${this.message}</div>
                    <div class="actions">
                        <button class="proceed" @click=${this.proceed}>${this.getButtonText()}</button>
                        <button class="cancel" @click=${this.close}>${this.t('form.cancel')}</button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('confirmation-dialog', ConfirmationDialog); 