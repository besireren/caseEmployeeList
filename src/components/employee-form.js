import { Router } from '@vaadin/router';
import { LitElement, css, html } from 'lit';
import { en } from '../locales/en.js';
import { tr } from '../locales/tr.js';
import { addEmployee, store, updateEmployee } from '../store.js';
import './confirmation-dialog.js';

export class EmployeeForm extends LitElement {
    static properties = {
        employee: { type: Object },
        isEdit: { type: Boolean },
        confirmationDialog: { type: Object },
        translations: { type: Object, state: true },
        countryCode: { type: String },
        departmentDropdownOpen: { type: Boolean, state: true },
        positionDropdownOpen: { type: Boolean, state: true },
        currentLanguage: { type: String, state: true },
        errors: { type: Object, state: true }
    };

    static styles = css`
        :host {
            display: block;
        }

        .form-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-group {
            margin-bottom: 20px;
            position: relative;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }

        input, select, .custom-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
        }

        input:focus, select:focus, .custom-select:focus {
            outline: none;
            border-color: var(--ing-orange, #FF6200);
            box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.2);
        }

        /* Custom dropdown styling */
        .custom-select {
            position: relative;
            cursor: pointer;
            user-select: none;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .custom-select-value {
            flex-grow: 1;
        }

        .custom-select-arrow {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--ing-orange, #FF6200);
        }

        .custom-select-options {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10;
            max-height: 200px;
            overflow-y: auto;
            display: none;
        }

        .custom-select-options.open {
            display: block;
        }

        .custom-select-option {
            padding: 8px 12px;
            cursor: pointer;
        }

        .custom-select-option:hover,
        .custom-select-option:focus {
            background-color: var(--ing-orange, #FF6200);
            color: white;
        }

        .custom-select-option.selected {
            background-color: #FFD2B3;
            color: black;
        }

        .phone-container {
            display: flex;
            gap: 8px;
        }

        .country-code {
            width: 85px;
            flex-shrink: 0;
            padding: 8px 12px;
            box-sizing: border-box;
        }

        .phone-input {
            flex-grow: 1;
            padding: 8px 12px;
            box-sizing: border-box;
        }

        .error {
            color: #f44336;
            font-size: 14px;
            margin-top: 5px;
        }

        .button-group {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
        }

        button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        button[type="submit"] {
            background-color: var(--ing-orange, #FF6200);
            color: white;
        }

        button[type="submit"]:hover {
            background-color: #e55800;
        }

        button[type="button"] {
            background-color: white;
            color: var(--ing-orange, #FF6200);
            border: 1px solid #E5E5E5;
        }

        button[type="button"]:hover {
            border-color: var(--ing-orange, #FF6200);
            background: #fff5f0;
        }

        @media (max-width: 768px) {
            .form-container {
                padding: 15px;
            }

            .button-group {
                flex-direction: column;
            }

            button {
                width: 100%;
            }
        }
    `;

    constructor() {
        super();
        this.employee = {
            firstName: '',
            lastName: '',
            dateOfEmployment: '',
            dateOfBirth: '',
            phone: '',
            email: '',
            department: 'Analytics',
            position: 'Junior'
        };
        this.isEdit = false;
        this.errors = {};
        this.confirmationDialog = {
            open: false,
            message: '',
            type: 'add'
        };
        
        // Initialize translations
        this.translations = {
            'en': en,
            'tr': tr
        };
        
        this.currentLanguage = document.documentElement.lang || 'tr';
        this.countryCode = '+(90)';
        this.departmentDropdownOpen = false;
        this.positionDropdownOpen = false;
        
        // Bind methods
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this._handleLanguageChange = this._handleLanguageChange.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        const location = window.location;
        const id = location.pathname.split('/edit/')[1];
        
        if (id) {
            this.isEdit = true;
            const employee = store.getState().employees.find(emp => emp.id === id);
            if (employee) {
                this.employee = { ...employee };
                // Extract country code if editing an existing employee
                if (this.employee.phone) {
                    if (this.employee.phone.startsWith('+(90)')) {
                        this.countryCode = '+(90)';
                    } else if (this.employee.phone.startsWith('+(1)')) {
                        this.countryCode = '+(1)';
                    }
                }
            }
        }
        
        // Add event listeners
        document.addEventListener('click', this.handleClickOutside);
        window.addEventListener('language-changed', this._handleLanguageChange);
    }
    
    disconnectedCallback() {
        super.disconnectedCallback();
        // Remove event listeners
        document.removeEventListener('click', this.handleClickOutside);
        window.removeEventListener('language-changed', this._handleLanguageChange);
    }
    
    _handleLanguageChange(event) {
        // Update language and trigger re-render
        this.currentLanguage = document.documentElement.lang || 'tr';
        
        // Re-validate form with new language
        if (Object.keys(this.errors).length > 0) {
            this.validateForm();
        }
        
        this.requestUpdate();
    }

    handleClickOutside(e) {
        // Close dropdowns when clicking outside
        const path = e.composedPath();
        const departmentDropdown = this.shadowRoot.querySelector('#departmentDropdown');
        const positionDropdown = this.shadowRoot.querySelector('#positionDropdown');
        
        if (departmentDropdown && !path.includes(departmentDropdown)) {
            this.departmentDropdownOpen = false;
        }
        
        if (positionDropdown && !path.includes(positionDropdown)) {
            this.positionDropdownOpen = false;
        }
        
        this.requestUpdate();
    }

    // Get translation text based on current language
    t(key) {
        const lang = this.currentLanguage || document.documentElement.lang || 'tr';
        const translations = this.translations[lang] || this.translations['en'];
        return translations[key] || key;
    }

    validateForm() {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+\(\d{1,3}\)\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/;

        if (!this.employee.firstName.trim()) {
            errors.firstName = this.t('validation.required').replace('{field}', this.t('form.firstName'));
        }

        if (!this.employee.lastName.trim()) {
            errors.lastName = this.t('validation.required').replace('{field}', this.t('form.lastName'));
        }

        if (!this.employee.dateOfEmployment) {
            errors.dateOfEmployment = this.t('validation.required').replace('{field}', this.t('form.dateOfEmployment'));
        }

        if (!this.employee.dateOfBirth) {
            errors.dateOfBirth = this.t('validation.required').replace('{field}', this.t('form.dateOfBirth'));
        }

        if (!this.employee.phone.trim()) {
            errors.phone = this.t('validation.required').replace('{field}', this.t('form.phone'));
        } else if (!phoneRegex.test(this.employee.phone)) {
            errors.phone = this.t('validation.phone.format');
        } else {
            // Check if phone has exactly 10 digits after the country code
            const phoneDigits = this.employee.phone.split(' ').slice(1).join('').replace(/\s/g, '');
            if (phoneDigits.length !== 10) {
                errors.phone = this.t('validation.phone.format');
            }
        }

        if (!this.employee.email.trim()) {
            errors.email = this.t('validation.required').replace('{field}', this.t('form.email'));
        } else if (!emailRegex.test(this.employee.email)) {
            errors.email = this.t('validation.email.invalid');
        }

        // Check for duplicate email
        const employees = store.getState().employees;
        const existingEmployee = employees.find(emp => 
            emp.email === this.employee.email && emp.id !== this.employee.id
        );
        
        if (existingEmployee) {
            errors.email = this.t('validation.email.exists');
        }

        this.errors = errors;
        return Object.keys(errors).length === 0;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.requestUpdate();
            return;
        }

        // Show confirmation dialog
        this.confirmationDialog = {
            open: true,
            message: this.isEdit 
                ? this.t('form.update.confirm').replace('{employee}', `${this.employee.firstName} ${this.employee.lastName}`)
                : this.t('form.add.confirm').replace('{employee}', `${this.employee.firstName} ${this.employee.lastName}`),
            type: this.isEdit ? 'update' : 'add'
        };
        this.requestUpdate();
    }

    handleConfirmSubmit() {
        if (this.isEdit) {
            store.dispatch(updateEmployee(this.employee));
        } else {
            store.dispatch(addEmployee(this.employee));
        }
        this.confirmationDialog = {
            ...this.confirmationDialog,
            open: false
        };
        this.requestUpdate();
        Router.go('/');
    }

    handleCancelSubmit() {
        this.confirmationDialog = {
            ...this.confirmationDialog,
            open: false
        };
        this.requestUpdate();
    }

    handleInput(e) {
        const { name, value } = e.target;
        this.employee = {
            ...this.employee,
            [name]: value
        };
    }

    // Custom dropdown handlers
    toggleDepartmentDropdown() {
        this.departmentDropdownOpen = !this.departmentDropdownOpen;
        if (this.departmentDropdownOpen) {
            this.positionDropdownOpen = false;
        }
        this.requestUpdate();
    }

    togglePositionDropdown() {
        this.positionDropdownOpen = !this.positionDropdownOpen;
        if (this.positionDropdownOpen) {
            this.departmentDropdownOpen = false;
        }
        this.requestUpdate();
    }

    selectDepartment(value) {
        this.employee = {
            ...this.employee,
            department: value
        };
        this.departmentDropdownOpen = false;
        this.requestUpdate();
    }

    selectPosition(value) {
        this.employee = {
            ...this.employee,
            position: value
        };
        this.positionDropdownOpen = false;
        this.requestUpdate();
    }

    handlePhoneInput(e) {
        const input = e.target;
        // Only allow digits (0-9) in the phone number
        let value = input.value.replace(/[^0-9]/g, ''); // Remove all non-digits
        
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        // Format with spaces to follow pattern: 532 123 45 67
        let formatted = '';
        if (value.length > 0) {
            // First group: 3 digits
            formatted = value.slice(0, Math.min(3, value.length));
            
            // Second group: 3 digits
            if (value.length > 3) {
                formatted += ' ' + value.slice(3, Math.min(6, value.length));
            }
            
            // Third group: 2 digits
            if (value.length > 6) {
                formatted += ' ' + value.slice(6, Math.min(8, value.length));
            }
            
            // Fourth group: 2 digits
            if (value.length > 8) {
                formatted += ' ' + value.slice(8, 10);
            }
        }
        
        // Update the input field with formatted value
        input.value = formatted;
        
        // Combine country code with phone number
        this.employee = {
            ...this.employee,
            phone: `${this.countryCode} ${formatted}`
        };
    }

    handleCountryCodeChange(e) {
        this.countryCode = e.target.value;
        // Update the full phone number with the new country code
        const phoneWithoutCode = this.employee.phone.split(' ').slice(1).join(' ');
        if (phoneWithoutCode) {
            this.employee = {
                ...this.employee,
                phone: `${this.countryCode} ${phoneWithoutCode}`
            };
        }
    }

    render() {
        // Extract phone number without country code for the input field
        let phoneWithoutCode = '';
        if (this.employee.phone) {
            const parts = this.employee.phone.split(' ');
            if (parts.length > 1) {
                phoneWithoutCode = parts.slice(1).join(' ');
            }
        }

        return html`
            <div class="form-container">
                <h2>${this.isEdit ? this.t('form.title.edit') : this.t('form.title.add')}</h2>
                <form @submit=${this.handleSubmit} autocomplete="chrome-off" novalidate>
                    <div class="form-group">
                        <label for="firstName">${this.t('form.firstName')}</label>
                        <input 
                            type="text" 
                            id="firstName" 
                            name="firstName"
                            maxlength="50"
                            autocomplete="new-password"
                            autocapitalize="off"
                            spellcheck="false"
                            .value=${this.employee.firstName}
                            @input=${this.handleInput}
                        >
                        ${this.errors.firstName ? html`<div class="error">${this.errors.firstName}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label for="lastName">${this.t('form.lastName')}</label>
                        <input 
                            type="text" 
                            id="lastName" 
                            name="lastName"
                            maxlength="50"
                            autocomplete="new-password"
                            autocapitalize="off"
                            spellcheck="false"
                            .value=${this.employee.lastName}
                            @input=${this.handleInput}
                        >
                        ${this.errors.lastName ? html`<div class="error">${this.errors.lastName}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label for="dateOfEmployment">${this.t('form.dateOfEmployment')}</label>
                        <input 
                            type="date" 
                            id="dateOfEmployment" 
                            name="dateOfEmployment"
                            autocomplete="new-password"
                            .value=${this.employee.dateOfEmployment}
                            @input=${this.handleInput}
                        >
                        ${this.errors.dateOfEmployment ? html`<div class="error">${this.errors.dateOfEmployment}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label for="dateOfBirth">${this.t('form.dateOfBirth')}</label>
                        <input 
                            type="date" 
                            id="dateOfBirth" 
                            name="dateOfBirth"
                            autocomplete="new-password"
                            .value=${this.employee.dateOfBirth}
                            @input=${this.handleInput}
                        >
                        ${this.errors.dateOfBirth ? html`<div class="error">${this.errors.dateOfBirth}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label for="phone">${this.t('form.phone')}</label>
                        <div class="phone-container">
                            <select 
                                class="country-code" 
                                @change=${this.handleCountryCodeChange}
                                .value=${this.countryCode}
                                autocomplete="new-password"
                            >
                                <option value="+(90)">+(90)</option>
                                <option value="+(1)">+(1)</option>
                            </select>
                            <input 
                                type="tel" 
                                id="phone" 
                                class="phone-input"
                                name="phoneInput"
                                placeholder="123 456 78 90"
                                autocomplete="new-password"
                                spellcheck="false"
                                .value=${phoneWithoutCode}
                                @input=${this.handlePhoneInput}
                            >
                        </div>
                        ${this.errors.phone ? html`<div class="error">${this.errors.phone}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label for="email">${this.t('form.email')}</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            autocomplete="new-password"
                            spellcheck="false"
                            .value=${this.employee.email}
                            @input=${this.handleInput}
                        >
                        ${this.errors.email ? html`<div class="error">${this.errors.email}</div>` : ''}
                    </div>

                    <div class="form-group">
                        <label for="department">${this.t('form.department')}</label>
                        <div id="departmentDropdown" class="custom-select" @click=${this.toggleDepartmentDropdown}>
                            <div class="custom-select-value">${this.t(`department.${this.employee.department.toLowerCase()}`)}</div>
                            <div class="custom-select-arrow">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M7 10l5 5 5-5z"/>
                                </svg>
                            </div>
                            <div class="custom-select-options ${this.departmentDropdownOpen ? 'open' : ''}">
                                <div class="custom-select-option ${this.employee.department === 'Analytics' ? 'selected' : ''}" 
                                    @click=${() => this.selectDepartment('Analytics')}>
                                    ${this.t('department.analytics')}
                                </div>
                                <div class="custom-select-option ${this.employee.department === 'Tech' ? 'selected' : ''}" 
                                    @click=${() => this.selectDepartment('Tech')}>
                                    ${this.t('department.tech')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="position">${this.t('form.position')}</label>
                        <div id="positionDropdown" class="custom-select" @click=${this.togglePositionDropdown}>
                            <div class="custom-select-value">${this.t(`position.${this.employee.position.toLowerCase()}`)}</div>
                            <div class="custom-select-arrow">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <path d="M7 10l5 5 5-5z"/>
                                </svg>
                            </div>
                            <div class="custom-select-options ${this.positionDropdownOpen ? 'open' : ''}">
                                <div class="custom-select-option ${this.employee.position === 'Junior' ? 'selected' : ''}" 
                                    @click=${() => this.selectPosition('Junior')}>
                                    ${this.t('position.junior')}
                                </div>
                                <div class="custom-select-option ${this.employee.position === 'Medior' ? 'selected' : ''}" 
                                    @click=${() => this.selectPosition('Medior')}>
                                    ${this.t('position.medior')}
                                </div>
                                <div class="custom-select-option ${this.employee.position === 'Senior' ? 'selected' : ''}" 
                                    @click=${() => this.selectPosition('Senior')}>
                                    ${this.t('position.senior')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="button-group">
                        <button type="button" @click=${() => Router.go('/')}>${this.t('form.cancel')}</button>
                        <button type="submit">${this.isEdit ? this.t('form.submit.update') : this.t('form.submit.add')}</button>
                    </div>
                </form>

                <confirmation-dialog
                    .open=${this.confirmationDialog.open}
                    .message=${this.confirmationDialog.message}
                    .type=${this.confirmationDialog.type}
                    @proceed=${this.handleConfirmSubmit}
                    @cancel=${this.handleCancelSubmit}
                ></confirmation-dialog>
            </div>
        `;
    }
}

customElements.define('employee-form', EmployeeForm); 