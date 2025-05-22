import { LitElement, css, html } from "lit";
import { en } from '../locales/en.js';
import { tr } from '../locales/tr.js';
import { deleteEmployee, store, updateEmployee } from "../store.js";
import "./confirmation-dialog.js";

export class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    viewMode: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    selectedEmployees: { type: Array },
    confirmationDialog: { type: Object },
    _updateCounter: { type: Number, state: true },
    translations: { type: Object, state: true },
    searchQuery: { type: String },
    currentLanguage: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      --ing-orange: #ff6200;
      --text-gray: #666;
      --border-gray: #e5e5e5;
      height: calc(100% - 200px);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .title {
      color: var(--ing-orange);
      font-size: 24px;
      font-weight: 500;
      margin: 0;
    }

    .view-toggle {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .view-toggle svg {
      width: 20px;
      height: 20px;
      color: var(--text-gray);
      cursor: pointer;
      opacity: 0.5;
      transition: all 0.2s ease;
    }

    .view-toggle svg:hover {
      opacity: 0.8;
    }

    .view-toggle svg.active {
      color: var(--ing-orange);
      opacity: 1;
    }

    .search-container {
      flex-grow: 1;
      max-width: 400px;
      margin: 0 20px;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 10px 12px 10px 36px;
      border: 1px solid var(--border-gray);
      border-radius: 4px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: var(--ing-orange);
    }

    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-gray);
      width: 16px;
      height: 16px;
    }

    .left-section {
      display: flex;
      align-items: center;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow-x: auto;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    table {
      width: 100%;
      min-width: 1000px;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid var(--border-gray);
      font-size: 14px;
      white-space: nowrap;
    }

    th {
      color: var(--ing-orange);
      font-weight: 500;
      white-space: nowrap;
      background: #fff;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    td {
      color: var(--text-gray);
    }

    tr:hover td {
      background: #f8f8f8;
    }

    .checkbox-cell {
      width: 48px;
      text-align: center;
      padding: 12px 8px;
    }

    .checkbox {
      width: 18px;
      height: 18px;
      border: 2px solid var(--border-gray);
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      display: inline-block;
      vertical-align: middle;
    }

    .checkbox.checked {
      background: var(--ing-orange);
      border-color: var(--ing-orange);
    }

    .checkbox.checked::after {
      content: "";
      position: absolute;
      left: 6px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      align-items: center;
    }

    .action-btn {
      color: var(--ing-orange);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }

    .action-btn svg {
      width: 20px;
      height: 20px;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
    }

    .pagination button {
      min-width: 32px;
      height: 32px;
      border: none;
      background: none;
      color: var(--text-gray);
      font-size: 14px;
      cursor: pointer;
      padding: 0 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination button:hover:not(:disabled) {
      background: #f0f0f0;
    }

    .pagination button.active {
      background: var(--ing-orange);
      color: white;
    }

    .pagination .arrow {
      color: var(--ing-orange);
      min-width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination .arrow:disabled {
      color: var(--text-gray);
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination .arrow svg {
      width: 20px;
      height: 20px;
    }

    .pagination .dots {
      color: var(--text-gray);
    }

    @media (max-width: 768px) {
      .table-container {
        overflow-x: auto;
      }
      
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      
      .left-section {
        width: 100%;
      }
      
      .search-container {
        max-width: 100%;
        margin: 0;
      }
    }

    .grid-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .grid-item {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .grid-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .grid-item-name {
      font-size: 18px;
      font-weight: 500;
      color: var(--ing-orange);
    }

    .grid-item-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .grid-item-info {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px 16px;
      font-size: 14px;
    }

    .grid-item-label {
      color: #999;
    }

    .grid-item-value {
      color: #666;
    }
  `;

  constructor() {
    super();
    this.employees = [];
    this.viewMode = "table";
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.selectedEmployees = [];
    this.searchQuery = "";
    this.confirmationDialog = {
      open: false,
      message: "",
      type: "delete",
      employeeId: null,
      data: null
    };
    this._updateCounter = 0;

    // Initialize translations
    this.translations = {
      'en': en,
      'tr': tr
    };

    // Subscribe to store changes
    store.subscribe(() => {
      this.employees = store.getState().employees;
      this.requestUpdate();
    });

    // Bind event handlers
    this._handleLanguageChange = this._handleLanguageChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.employees = store.getState().employees;
    window.addEventListener('language-changed', this._handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this._handleLanguageChange);
  }

  _handleLanguageChange(event) {
    // Force a complete re-render when language changes
    this.currentLanguage = document.documentElement.lang || 'tr';
    
    // Update all text elements
    this.selectedEmployees = [...this.selectedEmployees]; // Trigger re-render with same values
    
    // Increment update counter for testing purposes
    this._updateCounter = (this._updateCounter || 0) + 1;
    
    // Request update
    this.requestUpdate();
  }

  updated(changedProperties) {
    if (changedProperties.has('searchQuery')) {
      // Reset to first page when search changes
      this.currentPage = 1;
    }
  }

  handleSearch(e) {
    this.searchQuery = e.target.value.toLowerCase();
  }

  handleDelete(id, event) {
    event.preventDefault();
    event.stopPropagation();
    const employee = this.employees.find((emp) => emp.id === id);
    this.confirmationDialog = {
      open: true,
      type: "delete",
      message: this.t('list.delete.confirm').replace('{employee}', `${employee.firstName} ${employee.lastName}`),
      employeeId: id,
      data: null
    };
    this.requestUpdate();
  }

  handleUpdate(id, data, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const employee = this.employees.find((emp) => emp.id === id);
    this.confirmationDialog = {
      open: true,
      type: "update",
      message: `Are you sure you want to update ${employee.firstName} ${employee.lastName}'s information?`,
      employeeId: id,
      data: data
    };
    this.requestUpdate();
  }

  handleConfirmDialog() {
    if (this.confirmationDialog.employeeId) {
      if (this.confirmationDialog.type === "delete") {
        store.dispatch(deleteEmployee(this.confirmationDialog.employeeId));
      } else if (this.confirmationDialog.type === "update") {
        store.dispatch(
          updateEmployee(
            this.confirmationDialog.employeeId,
            this.confirmationDialog.data
          )
        );
      }
    }
    this.closeConfirmationDialog();
  }

  closeConfirmationDialog() {
    this.confirmationDialog = {
      open: false,
      message: "",
      type: "delete",
      employeeId: null,
      data: null
    };
  }

  toggleEmployeeSelection(id) {
    if (this.selectedEmployees.includes(id)) {
      this.selectedEmployees = this.selectedEmployees.filter(
        (empId) => empId !== id
      );
    } else {
      this.selectedEmployees = [...this.selectedEmployees, id];
    }
  }

  toggleAllSelection() {
    // Get current page IDs
    const currentPageIds = this.paginatedEmployees.map(emp => emp.id);
    
    // Check if all current page items are selected
    const allCurrentPageSelected = currentPageIds.every(id => this.selectedEmployees.includes(id));
    
    if (allCurrentPageSelected) {
      // Deselect all items on current page
      this.selectedEmployees = this.selectedEmployees.filter(id => !currentPageIds.includes(id));
    } else {
      // Add all current page items to selection (keeping any previously selected items)
      const newSelectedIds = [...new Set([...this.selectedEmployees, ...currentPageIds])];
      this.selectedEmployees = newSelectedIds;
    }
  }

  formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      // Extract day, month, year
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      // Format as DD/MM/YYYY with / separator consistently
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  }

  get filteredEmployees() {
    if (!this.searchQuery) {
      return this.employees;
    }
    
    return this.employees.filter(employee => {
      const formattedDateOfEmployment = this.formatDate(employee.dateOfEmployment);
      const formattedDateOfBirth = this.formatDate(employee.dateOfBirth);
      
      return (
        employee.firstName.toLowerCase().includes(this.searchQuery) ||
        employee.lastName.toLowerCase().includes(this.searchQuery) ||
        employee.email.toLowerCase().includes(this.searchQuery) ||
        employee.phone.toLowerCase().includes(this.searchQuery) ||
        formattedDateOfEmployment.toLowerCase().includes(this.searchQuery) ||
        formattedDateOfBirth.toLowerCase().includes(this.searchQuery) ||
        employee.department.toLowerCase().includes(this.searchQuery) ||
        employee.position.toLowerCase().includes(this.searchQuery) ||
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(this.searchQuery)
      );
    });
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  setPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  renderPagination() {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    let pages = [];

    // Case 1: If total pages <= 7, show all pages without ellipsis
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } 
    // Case 2: If on early pages (1-3), show first 5 pages + ellipsis + last page
    else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } 
    // Case 3: If on last pages (totalPages-2 to totalPages), show first page + ellipsis + last 5 pages
    else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } 
    // Case 4: If on middle pages, show first page + ellipsis + (current-1,current,current+1) + ellipsis + last page
    else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return html`
      <div class="pagination">
        <button
          class="arrow"
          ?disabled=${currentPage === 1}
          @click=${() => this.setPage(currentPage - 1)}
        >
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        ${pages.map((page) =>
          page === "..."
            ? html`<span class="dots">...</span>`
            : html`<button
                class=${currentPage === page ? "active" : ""}
                @click=${() => this.setPage(page)}
                ?disabled=${currentPage === page}
              >
                ${page}
              </button>`
        )}
        <button
          class="arrow"
          ?disabled=${currentPage === totalPages}
          @click=${() => this.setPage(currentPage + 1)}
        >
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    `;
  }

  renderTableView() {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="checkbox-cell">
                <div
                  class="checkbox ${this.selectedEmployees.length === this.paginatedEmployees.length && 
                    this.paginatedEmployees.every(emp => this.selectedEmployees.includes(emp.id))
                    ? "checked" : ""}"
                  @click=${this.toggleAllSelection}
                ></div>
              </th>
              <th>${this.t("list.table.firstName")}</th>
              <th>${this.t("list.table.lastName")}</th>
              <th>${this.t("form.dateOfEmployment")}</th>
              <th>${this.t("form.dateOfBirth")}</th>
              <th>${this.t("form.phone")}</th>
              <th>${this.t("list.table.email")}</th>
              <th>${this.t("list.table.department")}</th>
              <th>${this.t("list.table.position")}</th>
              <th>${this.t("list.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            ${this.paginatedEmployees.map(
              (employee) => html`
                <tr>
                  <td class="checkbox-cell">
                    <div
                      class="checkbox ${this.selectedEmployees?.includes(
                        employee.id
                      )
                        ? "checked"
                        : ""}"
                      @click=${() => this.toggleEmployeeSelection(employee.id)}
                    ></div>
                  </td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${this.formatDate(employee.dateOfEmployment)}</td>
                  <td>${this.formatDate(employee.dateOfBirth)}</td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${this.translateDepartment(employee.department)}</td>
                  <td>${this.translatePosition(employee.position)}</td>
                  <td>
                    <div class="actions">
                      <a
                        href="/edit/${employee.id}"
                        class="action-btn"
                        title="${this.t("list.actions.edit")}"
                      >
                        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                          <path
                            d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                            fill="currentColor"
                          />
                        </svg>
                      </a>
                      <span
                        class="action-btn"
                        @click=${(e) => this.handleDelete(employee.id, e)}
                        title="${this.t("list.actions.delete")}"
                      >
                        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                          <path
                            d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  translateDepartment(department) {
    const key = `department.${department.toLowerCase()}`;
    return this.t(key) || department;
  }
  
  translatePosition(position) {
    const key = `position.${position.toLowerCase()}`;
    return this.t(key) || position;
  }

  toggleViewMode(mode) {
    this.viewMode = mode;
  }

  renderGridView() {
    return html`
      <div class="grid-view">
        ${this.paginatedEmployees.map(
          (emp) => html`
            <div class="grid-item">
              <div class="grid-item-header">
                <div class="grid-item-name">
                  ${emp.firstName} ${emp.lastName}
                </div>
                <div class="grid-item-actions">
                  <a href="/edit/${emp.id}" class="action-btn" title="${this.t('list.actions.edit')}">
                    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                      <path
                        d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                  <span
                    class="action-btn"
                    @click=${(e) => this.handleDelete(emp.id, e)}
                    title="${this.t('list.actions.delete')}"
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                      <path
                        d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div class="grid-item-info">
                <div class="grid-item-label">${this.t('list.table.department')}:</div>
                <div class="grid-item-value">${this.translateDepartment(emp.department)}</div>
                <div class="grid-item-label">${this.t('list.table.position')}:</div>
                <div class="grid-item-value">${this.translatePosition(emp.position)}</div>
                <div class="grid-item-label">${this.t('list.table.email')}:</div>
                <div class="grid-item-value">${emp.email}</div>
                <div class="grid-item-label">${this.t('form.phone')}:</div>
                <div class="grid-item-value">${emp.phone}</div>
                <div class="grid-item-label">${this.t('form.dateOfEmployment')}:</div>
                <div class="grid-item-value">
                  ${this.formatDate(emp.dateOfEmployment)}
                </div>
                <div class="grid-item-label">${this.t('form.dateOfBirth')}:</div>
                <div class="grid-item-value">
                  ${this.formatDate(emp.dateOfBirth)}
                </div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  // Get translation text based on current language
  t(key) {
    const lang = document.documentElement.lang || 'tr';
    const translations = this.translations[lang] || this.translations['en'];
    return translations[key] || key;
  }

  render() {
    return html`
      <div>
        <div class="header">
          <div class="left-section">
            <h1 class="title">${this.t("app.nav.title")}</h1>
            <div class="search-container">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  fill="currentColor"
                />
              </svg>
              <input 
                type="text" 
                class="search-input" 
                placeholder="${this.t('list.search.placeholder') || 'Search employees...'}"
                .value=${this.searchQuery}
                @input=${this.handleSearch}
              />
            </div>
          </div>
          <div class="view-toggle">
            <svg
              class="${this.viewMode === "table" ? "active" : ""}"
              @click=${() => this.toggleViewMode("table")}
              viewBox="0 0 24 24"
              fill="none"
              width="20"
              height="20"
            >
              <path
                d="M3 4H21V8H3V4ZM3 10H21V14H3V10ZM3 16H21V20H3V16Z"
                fill="currentColor"
              />
            </svg>
            <svg
              class="${this.viewMode === "grid" ? "active" : ""}"
              @click=${() => this.toggleViewMode("grid")}
              viewBox="0 0 24 24"
              fill="none"
              width="20" 
              height="20"
            >
              <path
                d="M3 3H11V11H3V3ZM3 13H11V21H3V13ZM13 3H21V11H13V3ZM13 13H21V21H13V13Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        ${this.filteredEmployees.length === 0 ? 
          html`<div class="no-results">${this.t('list.search.noResults') || 'No employees found matching your search.'}</div>` : 
          html`${this.viewMode === "table" ? this.renderTableView() : this.renderGridView()}
                ${this.renderPagination()}`}
        <confirmation-dialog
          .open=${this.confirmationDialog?.open || false}
          .message=${this.confirmationDialog?.message || ""}
          .type=${this.confirmationDialog?.type || "delete"}
          @proceed=${this.handleConfirmDialog}
          @cancel=${this.closeConfirmationDialog}
        ></confirmation-dialog>
      </div>
    `;
  }
}

customElements.define("employee-list", EmployeeList);