import { fixture, html, expect } from '@open-wc/testing';
import { EmployeeList } from '../src/components/employee-list.js';
import sinon from 'sinon';

// Mock store
const mockStore = {
    getState: sinon.stub(),
    dispatch: sinon.stub(),
    subscribe: sinon.stub()
};

// Mock store module
window.mockStoreModule = {
    store: mockStore,
    default: { store: mockStore }
};

describe('EmployeeList', () => {
    let element;
    const mockEmployees = [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            dateOfEmployment: '2023-01-01',
            dateOfBirth: '1990-01-01',
            phone: '+(90) 532 123 45 67',
            email: 'john@example.com',
            department: 'Tech',
            position: 'Senior'
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfEmployment: '2023-02-01',
            dateOfBirth: '1992-01-01',
            phone: '+(90) 532 987 65 43',
            email: 'jane@example.com',
            department: 'Analytics',
            position: 'Junior'
        }
    ];

    beforeEach(async () => {
        // Reset store mocks
        mockStore.getState.reset();
        mockStore.dispatch.reset();
        mockStore.subscribe.reset();

        // Setup default store state
        mockStore.getState.returns({ employees: mockEmployees });

        // Create element
        element = await fixture(html`<employee-list></employee-list>`);
        element.employees = mockEmployees; // Set employees directly
        await element.updateComplete;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('renders in table view by default', async () => {
        const table = element.shadowRoot.querySelector('table');
        expect(table).to.exist;
    });

    it('can switch to grid view', async () => {
        const viewToggle = element.shadowRoot.querySelector('.view-toggle');
        const gridButton = viewToggle.querySelectorAll('svg')[1];
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        gridButton.dispatchEvent(event);
        await element.updateComplete;
        
        const gridView = element.shadowRoot.querySelector('.grid-view');
        expect(gridView).to.exist;
    });

    it('displays correct number of employees', async () => {
        await element.updateComplete;
        const rows = element.shadowRoot.querySelectorAll('tbody tr');
        expect(rows.length).to.equal(mockEmployees.length);
    });

    it('formats dates correctly', () => {
        const formattedDate = element.formatDate('2023-01-01');
        expect(formattedDate).to.equal('01/01/2023');
    });

    it('handles invalid dates gracefully', () => {
        const invalidDate = element.formatDate('invalid-date');
        expect(invalidDate).to.equal('invalid-date');
    });

    it('toggles employee selection', async () => {
        element.selectedEmployees = [];
        await element.updateComplete;
        
        element.toggleEmployeeSelection('1');
        await element.updateComplete;
        expect(element.selectedEmployees).to.include('1');

        element.toggleEmployeeSelection('1');
        await element.updateComplete;
        expect(element.selectedEmployees).to.not.include('1');
    });

    it('toggles all employee selection', async () => {
        element.selectedEmployees = [];
        await element.updateComplete;
        
        element.toggleAllSelection();
        await element.updateComplete;
        expect(element.selectedEmployees.length).to.equal(mockEmployees.length);

        element.toggleAllSelection();
        await element.updateComplete;
        expect(element.selectedEmployees.length).to.equal(0);
    });

    it('handles pagination correctly', async () => {
        element.itemsPerPage = 1;
        element.employees = mockEmployees;
        await element.updateComplete;

        expect(element.totalPages).to.equal(2);
        expect(element.currentPage).to.equal(1);

        element.setPage(2);
        await element.updateComplete;
        expect(element.currentPage).to.equal(2);

        element.setPage(1);
        await element.updateComplete;
        expect(element.currentPage).to.equal(1);
    });

    it('opens delete confirmation dialog', async () => {
        element.handleDelete('1', new Event('click'));
        await element.updateComplete;

        expect(element.confirmationDialog.open).to.be.true;
        expect(element.confirmationDialog.type).to.equal('delete');
        expect(element.confirmationDialog.employeeId).to.equal('1');
    });

    it('translates department and position correctly', () => {
        document.documentElement.lang = 'en';
        
        const translatedDepartment = element.translateDepartment('Tech');
        expect(translatedDepartment).to.equal('Tech');

        const translatedPosition = element.translatePosition('Senior');
        expect(translatedPosition).to.equal('Senior');
    });

    it('handles language changes', async () => {
        const event = new CustomEvent('language-changed', { 
            detail: { language: 'tr' } 
        });
        window.dispatchEvent(event);
        await element.updateComplete;

        expect(element._updateCounter).to.be.greaterThan(0);
    });

    // New tests for search functionality
    it('initializes search with empty string', async () => {
        expect(element.searchQuery).to.equal('');
    });
    
    it('filters employees based on search query', async () => {
        // Make sure we have the mock data
        element.employees = mockEmployees;
        await element.updateComplete;
        
        // Initially shows all employees
        expect(element.filteredEmployees.length).to.equal(mockEmployees.length);
        
        // Search by first name
        element.searchQuery = 'john';
        await element.updateComplete;
        expect(element.filteredEmployees.length).to.equal(1);
        expect(element.filteredEmployees[0].firstName).to.equal('John');
        
        // Search by last name
        element.searchQuery = 'smith';
        await element.updateComplete;
        expect(element.filteredEmployees.length).to.equal(1);
        expect(element.filteredEmployees[0].lastName).to.equal('Smith');
        
        // Search by department
        element.searchQuery = 'tech';
        await element.updateComplete;
        expect(element.filteredEmployees.length).to.equal(1);
        expect(element.filteredEmployees[0].department).to.equal('Tech');
        
        // Search by position
        element.searchQuery = 'junior';
        await element.updateComplete;
        expect(element.filteredEmployees.length).to.equal(1);
        expect(element.filteredEmployees[0].position).to.equal('Junior');
        
        // Search by email
        element.searchQuery = 'john@example';
        await element.updateComplete;
        expect(element.filteredEmployees.length).to.equal(1);
        expect(element.filteredEmployees[0].email).to.equal('john@example.com');
        
        // Search by phone
        element.searchQuery = '532 123';
        await element.updateComplete;
        expect(element.filteredEmployees.length).to.equal(1);
        expect(element.filteredEmployees[0].phone).to.include('532 123');
    });
    
    it('handles search input events', async () => {
        const searchInput = element.shadowRoot.querySelector('.search-input');
        expect(searchInput).to.exist;
        
        // Create an input event
        const event = new Event('input');
        searchInput.value = 'john';
        searchInput.dispatchEvent(event);
        
        // Should update searchQuery
        expect(element.searchQuery).to.equal('john');
    });
    
    it('displays no results message when search has no matches', async () => {
        // Initially no "no results" message
        let noResultsMessage = element.shadowRoot.querySelector('.no-results');
        expect(noResultsMessage).to.not.exist;
        
        // Set a search query with no matches
        element.searchQuery = 'xyz123nonexistent';
        await element.updateComplete;
        
        // Should display no results message
        noResultsMessage = element.shadowRoot.querySelector('.no-results');
        expect(noResultsMessage).to.exist;
    });
    
    it('resets to first page when search query changes', async () => {
        element.itemsPerPage = 1;
        element.currentPage = 2;
        await element.updateComplete;
        
        // Change search query
        element.searchQuery = 'john';
        await element.updateComplete;
        
        // Should reset to page 1
        expect(element.currentPage).to.equal(1);
    });
    
    it('formats date for searching', async () => {
        const formatted = element.formatDate('2023-01-01');
        expect(formatted).to.equal('01/01/2023');
        
        // Verify it's used in search
        element.searchQuery = '01/01/2023';
        await element.updateComplete;
        
        const filtered = element.filteredEmployees;
        expect(filtered.some(emp => emp.dateOfEmployment === '2023-01-01')).to.be.true;
    });
    
    it('searches across full name (first + last)', async () => {
        element.searchQuery = 'john doe';
        await element.updateComplete;
        
        expect(element.filteredEmployees.length).to.equal(1);
        expect(element.filteredEmployees[0].firstName).to.equal('John');
        expect(element.filteredEmployees[0].lastName).to.equal('Doe');
    });
    
    // Tests for the improved select all functionality
    it('shows header checkbox as checked when all paginated employees are selected', async () => {
        // Set paginated employees
        element.itemsPerPage = 2;
        element.employees = mockEmployees;
        element.selectedEmployees = mockEmployees.map(emp => emp.id);
        await element.updateComplete;
        
        const headerCheckbox = element.shadowRoot.querySelector('thead .checkbox');
        expect(headerCheckbox.classList.contains('checked')).to.be.true;
    });
    
    it('shows header checkbox as unchecked when not all paginated employees are selected', async () => {
        // Set paginated employees but only select one
        element.itemsPerPage = 2;
        element.employees = mockEmployees;
        element.selectedEmployees = [mockEmployees[0].id];
        await element.updateComplete;
        
        const headerCheckbox = element.shadowRoot.querySelector('thead .checkbox');
        expect(headerCheckbox.classList.contains('checked')).to.be.false;
    });
    
    it('selects only current page items when toggle all is clicked', async () => {
        // Setup: Two pages, none selected
        element.itemsPerPage = 1;
        element.employees = mockEmployees;
        element.selectedEmployees = [];
        element.currentPage = 1;
        await element.updateComplete;
        
        // Click "select all" on page 1
        const headerCheckbox = element.shadowRoot.querySelector('thead .checkbox');
        headerCheckbox.click();
        await element.updateComplete;
        
        // Should have one item selected (from page 1)
        expect(element.selectedEmployees.length).to.equal(1);
        expect(element.selectedEmployees[0]).to.equal(mockEmployees[0].id);
        
        // Go to page 2
        element.currentPage = 2;
        await element.updateComplete;
        
        // Select all on page 2
        const headerCheckbox2 = element.shadowRoot.querySelector('thead .checkbox');
        headerCheckbox2.click();
        await element.updateComplete;
        
        // Should now have both items selected
        expect(element.selectedEmployees.length).to.equal(2);
        expect(element.selectedEmployees).to.include(mockEmployees[0].id);
        expect(element.selectedEmployees).to.include(mockEmployees[1].id);
    });
    
    it('deselects only current page items when toggle all is clicked on checked state', async () => {
        // Create a more controlled test scenario with 3 employees
        const testEmployees = [
            { 
                id: 'a1', 
                firstName: 'Test1', 
                lastName: 'User1',
                dateOfEmployment: '2023-01-01',
                dateOfBirth: '1990-01-01',
                phone: '+(90) 532 123 45 67',
                email: 'test1@example.com',
                department: 'Tech',
                position: 'Senior'
            },
            { 
                id: 'a2', 
                firstName: 'Test2', 
                lastName: 'User2',
                dateOfEmployment: '2023-01-01',
                dateOfBirth: '1990-01-01',
                phone: '+(90) 532 123 45 67',
                email: 'test2@example.com',
                department: 'Tech',
                position: 'Senior'
            },
            { 
                id: 'a3', 
                firstName: 'Test3', 
                lastName: 'User3',
                dateOfEmployment: '2023-01-01',
                dateOfBirth: '1990-01-01',
                phone: '+(90) 532 123 45 67',
                email: 'test3@example.com',
                department: 'Tech',
                position: 'Senior'
            }
        ];
        
        // Setup: Two items per page, initially all selected
        element.employees = testEmployees;
        element.itemsPerPage = 2;
        element.selectedEmployees = ['a1', 'a2', 'a3']; // All three selected
        element.currentPage = 1; // First page (a1, a2)
        await element.updateComplete;
        
        // Execute toggle - all items on page 1 are selected, so this should deselect them
        element.toggleAllSelection();
        await element.updateComplete;
        
        // Should deselect page 1 items (a1, a2) but keep a3
        expect(element.selectedEmployees).to.deep.equal(['a3']);
    });
    
    it('updates header checkbox state when individual items are selected', async () => {
        // Setup: One page, none selected
        element.itemsPerPage = 2;
        element.employees = mockEmployees;
        element.selectedEmployees = [];
        await element.updateComplete;
        
        // Initially unchecked
        let headerCheckbox = element.shadowRoot.querySelector('thead .checkbox');
        expect(headerCheckbox.classList.contains('checked')).to.be.false;
        
        // Select first item
        const firstCheckbox = element.shadowRoot.querySelector('tbody tr:first-child .checkbox');
        firstCheckbox.click();
        await element.updateComplete;
        
        // Still unchecked (not all selected)
        headerCheckbox = element.shadowRoot.querySelector('thead .checkbox');
        expect(headerCheckbox.classList.contains('checked')).to.be.false;
        
        // Select second item
        const secondCheckbox = element.shadowRoot.querySelector('tbody tr:nth-child(2) .checkbox');
        secondCheckbox.click();
        await element.updateComplete;
        
        // Now all checked
        headerCheckbox = element.shadowRoot.querySelector('thead .checkbox');
        expect(headerCheckbox.classList.contains('checked')).to.be.true;
    });
}); 