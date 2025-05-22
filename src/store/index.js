import { createStore } from 'redux';
import { defaultEmployees } from './defaultData.js';

// Action Types
export const ADD_EMPLOYEE = 'ADD_EMPLOYEE';
export const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
export const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

// Action Creators
export const addEmployee = (employee) => {
    return {
        type: ADD_EMPLOYEE,
        payload: {
            ...employee,
            id: Date.now().toString() // Simple unique ID generation
        }
    };
};

export const updateEmployee = (employee) => {
    return {
        type: UPDATE_EMPLOYEE,
        payload: employee
    };
};

export const deleteEmployee = (id) => {
    return {
        type: DELETE_EMPLOYEE,
        payload: id
    };
};

export const setLoading = (loading) => {
    return {
        type: SET_LOADING,
        payload: loading
    };
};

export const setError = (error) => {
    return {
        type: SET_ERROR,
        payload: error
    };
};

// Initial State
const initialState = {
    employees: defaultEmployees,
    loading: false,
    error: null
};

// Reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_EMPLOYEE:
            return {
                ...state,
                employees: [...state.employees, action.payload]
            };
        case UPDATE_EMPLOYEE:
            return {
                ...state,
                employees: state.employees.map(emp => 
                    emp.id === action.payload.id ? action.payload : emp
                )
            };
        case DELETE_EMPLOYEE:
            return {
                ...state,
                employees: state.employees.filter(emp => emp.id !== action.payload)
            };
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

// Create Store
export const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
); 