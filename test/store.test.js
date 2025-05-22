import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import { 
  store, 
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setLoading,
  setError,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  SET_LOADING,
  SET_ERROR
} from '../src/store/index.js';

describe('Store', () => {
  let initialState;
  
  beforeEach(() => {
    // Save the initial state to compare later
    initialState = { ...store.getState() };
    
    // Reset date.now for stable IDs
    sinon.stub(Date, 'now').returns(12345);
  });
  
  afterEach(() => {
    // Restore Date.now
    sinon.restore();
  });
  
  it('initializes with default employees', () => {
    const state = store.getState();
    expect(state.employees).to.exist;
    expect(state.employees.length).to.be.greaterThan(0);
    expect(state.loading).to.be.false;
    expect(state.error).to.be.null;
  });
  
  it('adds a new employee', () => {
    const newEmployee = {
      firstName: 'Test',
      lastName: 'User',
      dateOfEmployment: '2023-01-01',
      dateOfBirth: '1990-01-01',
      phone: '+(90) 532 123 45 67',
      email: 'test@example.com',
      department: 'Tech',
      position: 'Senior'
    };
    
    store.dispatch(addEmployee(newEmployee));
    
    const state = store.getState();
    const addedEmployee = state.employees.find(emp => emp.email === 'test@example.com');
    
    expect(addedEmployee).to.exist;
    expect(addedEmployee.id).to.equal('12345');
    expect(addedEmployee.firstName).to.equal('Test');
    expect(addedEmployee.lastName).to.equal('User');
  });
  
  it('updates an existing employee', () => {
    // First get an existing employee
    const initialState = store.getState();
    const existingEmployee = initialState.employees[0];
    
    // Create updated employee data
    const updatedEmployee = {
      ...existingEmployee,
      firstName: 'Updated',
      lastName: 'Name'
    };
    
    store.dispatch(updateEmployee(updatedEmployee));
    
    const state = store.getState();
    const employee = state.employees.find(emp => emp.id === existingEmployee.id);
    
    expect(employee).to.exist;
    expect(employee.firstName).to.equal('Updated');
    expect(employee.lastName).to.equal('Name');
  });
  
  it('deletes an employee', () => {
    // First get an existing employee
    const initialState = store.getState();
    const employeeToDelete = initialState.employees[0];
    const initialCount = initialState.employees.length;
    
    store.dispatch(deleteEmployee(employeeToDelete.id));
    
    const state = store.getState();
    
    expect(state.employees.length).to.equal(initialCount - 1);
    expect(state.employees.find(emp => emp.id === employeeToDelete.id)).to.be.undefined;
  });
  
  it('sets loading state', () => {
    expect(store.getState().loading).to.be.false;
    
    store.dispatch(setLoading(true));
    expect(store.getState().loading).to.be.true;
    
    store.dispatch(setLoading(false));
    expect(store.getState().loading).to.be.false;
  });
  
  it('sets error state', () => {
    expect(store.getState().error).to.be.null;
    
    const testError = 'Test error message';
    store.dispatch(setError(testError));
    expect(store.getState().error).to.equal(testError);
    
    store.dispatch(setError(null));
    expect(store.getState().error).to.be.null;
  });
  
  it('generates correct action objects', () => {
    const newEmployee = { firstName: 'Test', lastName: 'User' };
    const employeeID = '123';
    const error = 'Test error';
    
    // Test addEmployee action
    const addAction = addEmployee(newEmployee);
    expect(addAction.type).to.equal(ADD_EMPLOYEE);
    expect(addAction.payload.firstName).to.equal('Test');
    expect(addAction.payload.id).to.exist;
    
    // Test updateEmployee action
    const updateAction = updateEmployee(newEmployee);
    expect(updateAction.type).to.equal(UPDATE_EMPLOYEE);
    expect(updateAction.payload).to.equal(newEmployee);
    
    // Test deleteEmployee action
    const deleteAction = deleteEmployee(employeeID);
    expect(deleteAction.type).to.equal(DELETE_EMPLOYEE);
    expect(deleteAction.payload).to.equal(employeeID);
    
    // Test setLoading action
    const loadingAction = setLoading(true);
    expect(loadingAction.type).to.equal(SET_LOADING);
    expect(loadingAction.payload).to.be.true;
    
    // Test setError action
    const errorAction = setError(error);
    expect(errorAction.type).to.equal(SET_ERROR);
    expect(errorAction.payload).to.equal(error);
  });
}); 