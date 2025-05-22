import { fixture, html, expect } from '@open-wc/testing';
import { EmployeeForm } from '../src/components/employee-form.js';

// Mock translations
window.translations = {
    en: {
        'validation.required': '{field} is required',
        'validation.email.invalid': 'Invalid email format',
        'validation.phone.format': 'Invalid phone format',
        'validation.email.exists': 'Email already exists',
        'form.firstName': 'First Name',
        'form.lastName': 'Last Name',
        'form.dateOfEmployment': 'Date of Employment',
        'form.dateOfBirth': 'Date of Birth',
        'form.phone': 'Phone',
        'form.email': 'Email',
        'form.department': 'Department',
        'form.position': 'Position',
        'form.title.add': 'Add Employee',
        'form.title.edit': 'Edit Employee',
        'form.add.confirm': 'Are you sure you want to add {employee}?',
        'form.update.confirm': 'Are you sure you want to update {employee}?'
    }
};

// Mock store
window.store = {
    getState: () => ({ employees: [] }),
    dispatch: () => {},
    subscribe: () => {}
};

// Mock Router
window.Router = {
    go: () => {}
};

describe('EmployeeForm', () => {
    let element;

    beforeEach(async () => {
        element = await fixture(html`<employee-form></employee-form>`);
        await element.updateComplete;
    });

    it('renders form fields correctly', async () => {
        const form = element.shadowRoot.querySelector('form');
        expect(form).to.exist;

        const inputs = form.querySelectorAll('input');
        expect(inputs.length).to.be.greaterThan(0);
    });

    it('initializes with default values', async () => {
        expect(element.employee).to.deep.include({
            firstName: '',
            lastName: '',
            dateOfEmployment: '',
            dateOfBirth: '',
            phone: '',
            email: '',
            department: 'Analytics',
            position: 'Junior'
        });
        expect(element.isEdit).to.be.false;
        expect(element.countryCode).to.equal('+(90)');
    });

    it('validates required fields', async () => {
        const form = element.shadowRoot.querySelector('form');
        const submitButton = form.querySelector('button[type="submit"]');
        
        submitButton.click();
        await element.updateComplete;

        expect(element.errors.firstName).to.exist;
        expect(element.errors.lastName).to.exist;
        expect(element.errors.dateOfEmployment).to.exist;
        expect(element.errors.dateOfBirth).to.exist;
        expect(element.errors.email).to.exist;
    });

    it('formats phone number correctly', async () => {
        element.handlePhoneInput({ target: { value: '5321234567' } });
        await element.updateComplete;

        expect(element.employee.phone).to.equal('+(90) 532 123 45 67');
    });

    it('validates email format', async () => {
        element.employee = {
            ...element.employee,
            email: 'invalid-email'
        };
        await element.updateComplete;

        element.validateForm();
        await element.updateComplete;

        expect(element.errors.email).to.exist;
    });

    it('validates empty date fields', async () => {
        element.employee = {
            ...element.employee,
            dateOfBirth: '',
            dateOfEmployment: ''
        };
        await element.updateComplete;

        element.validateForm();
        await element.updateComplete;

        expect(element.errors.dateOfBirth).to.exist;
        expect(element.errors.dateOfEmployment).to.exist;
    });

    it('handles form submission in add mode', async () => {
        element.employee = {
            firstName: 'John',
            lastName: 'Doe',
            dateOfEmployment: '2023-01-01',
            dateOfBirth: '1990-01-01',
            phone: '+(90) 532 123 45 67',
            email: 'john@example.com',
            department: 'Tech',
            position: 'Senior'
        };
        await element.updateComplete;

        const form = element.shadowRoot.querySelector('form');
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.click();
        await element.updateComplete;

        expect(element.confirmationDialog.open).to.be.true;
        expect(element.confirmationDialog.type).to.equal('add');
    });

    it('handles form submission in edit mode', async () => {
        element.isEdit = true;
        element.employee = {
            firstName: 'John',
            lastName: 'Doe',
            dateOfEmployment: '2023-01-01',
            dateOfBirth: '1990-01-01',
            phone: '+(90) 532 123 45 67',
            email: 'john@example.com',
            department: 'Tech',
            position: 'Senior'
        };
        await element.updateComplete;

        const form = element.shadowRoot.querySelector('form');
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.click();
        await element.updateComplete;

        expect(element.confirmationDialog.open).to.be.true;
        expect(element.confirmationDialog.type).to.equal('update');
    });

    it('handles confirmation dialog actions', async () => {
        element.employee = {
            firstName: 'John',
            lastName: 'Doe',
            dateOfEmployment: '2023-01-01',
            dateOfBirth: '1990-01-01',
            phone: '+(90) 532 123 45 67',
            email: 'john@example.com',
            department: 'Tech',
            position: 'Senior'
        };
        element.confirmationDialog = {
            open: true,
            type: 'add'
        };
        await element.updateComplete;

        element.handleConfirmSubmit();
        expect(element.confirmationDialog.open).to.be.false;

        element.handleCancelSubmit();
        expect(element.confirmationDialog.open).to.be.false;
    });

    it('handles department selection', async () => {
        element.toggleDepartmentDropdown();
        await element.updateComplete;
        expect(element.departmentDropdownOpen).to.be.true;

        element.selectDepartment('Tech');
        await element.updateComplete;
        expect(element.employee.department).to.equal('Tech');
        expect(element.departmentDropdownOpen).to.be.false;
    });

    it('handles position selection', async () => {
        element.togglePositionDropdown();
        await element.updateComplete;
        expect(element.positionDropdownOpen).to.be.true;

        element.selectPosition('Senior');
        await element.updateComplete;
        expect(element.employee.position).to.equal('Senior');
        expect(element.positionDropdownOpen).to.be.false;
    });

    it('handles country code change', async () => {
        element.employee = {
            ...element.employee,
            phone: '+(90) 532 123 45 67'
        };
        await element.updateComplete;

        element.handleCountryCodeChange({ target: { value: '+(1)' } });
        await element.updateComplete;

        expect(element.employee.phone).to.equal('+(1) 532 123 45 67');
    });

    it('handles input changes', async () => {
        element.handleInput({ target: { name: 'firstName', value: 'John' } });
        await element.updateComplete;

        expect(element.employee.firstName).to.equal('John');
    });

    it('validates duplicate email', async () => {
        window.store.getState = () => ({
            employees: [
                {
                    id: '1',
                    email: 'john@example.com'
                }
            ]
        });

        element.employee = {
            ...element.employee,
            email: 'john@example.com'
        };
        await element.updateComplete;

        element.validateForm();
        await element.updateComplete;

        expect(element.errors.email).to.exist;
    });

    it('validates phone format', async () => {
        element.employee = {
            ...element.employee,
            phone: 'invalid-phone'
        };
        await element.updateComplete;

        element.validateForm();
        await element.updateComplete;

        expect(element.errors.phone).to.exist;
    });
}); 