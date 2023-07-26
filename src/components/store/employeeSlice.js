import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authHeader } from '../pages/authorization/authHeader';


const API_URL = 'https://sf-final-project-be.herokuapp.com/api/officers'; 


export let fetchEmployeeList = createAsyncThunk(
	'employees/fetchEmployeeList',
	async function (_, {rejectWithValue}) {
		try {
			let response = await fetch(`${API_URL}/`, {
				method: 'GET',
				headers: authHeader()
			});

			if(!response.ok) {
				throw new Error('Error of getting data')
			}

			let employeeListData = await response.json();
			localStorage.setItem('employeeList', JSON.stringify(employeeListData.officers));
			
			return employeeListData;
		}
		catch(error) {
			return rejectWithValue(error.message)
		}
	}
);

export let fetchAddEmployee = createAsyncThunk(
	'employees/fetchAddEmployee',
	async function (values, {rejectWithValue, dispatch}) {
		let firstName = values.firstName && values.firstName[0].toUpperCase() + values.firstName.slice(1).toLowerCase();
		let lastName = values.lastName && values.lastName[0].toUpperCase() + values.lastName.slice(1).toLowerCase();
		try {
			let officer = {
				email: values.email.toLowerCase(),
				password: values.password,
				firstName,
				lastName,
				approved: false,
			};

			let response = await fetch(`${API_URL}`, {
				method: 'POST',
				headers: authHeader(),
				body: JSON.stringify(officer)
			});

			if(!response.ok) {
				throw new Error('Error of additing data')
			}

			let officerData = await response.json();
			dispatch(addEmployee(officerData));

		}
		catch(error) {
			return rejectWithValue(error.message)
		}
	}
);

export let fetchRemoveEmployee = createAsyncThunk(
	'employees/fetchRemoveEmployee',
	async function (id, {rejectWithValue, dispatch}) {
		try {
			let response = await fetch(`${API_URL}/${id}`, {
				method: 'DELETE',
				headers: authHeader()
			});

			if(!response.ok) {
				throw new Error('Error of removing data');
			}

			dispatch(removeEmployee({id}))
		}
		catch(error) {
			return rejectWithValue(error.message)
		}
	}
);

export let fetchChangeDetails = createAsyncThunk(
	'employees/fetchChangeDetails',
	async function (values, {rejectWithValue, dispatch}) {
		let firstName = values.firstName && values.firstName[0].toUpperCase() + values.firstName.slice(1).toLowerCase();
		let lastName = values.lastName && values.lastName[0].toUpperCase() + values.lastName.slice(1).toLowerCase();

		try {
			let response = await fetch(`${API_URL}/${values._id}`, {
				method: 'PUT',
				headers: authHeader(),
				body: JSON.stringify({
					firstName,
					lastName,
					approved: values.approved,
					
				})
			});

			if(!response.ok) {
				throw new Error('Error of updating data')
			}

			let updatedData = await response.json();
			dispatch(changeDetails(updatedData));
			
		}
		catch(error) {
			return rejectWithValue(error.message)
		}
	}
);

let setPending = (state) => {
	state.fetchStatus = 'loading';
	state.fetchError = null;
};

let setFulfilled = (state) => {
	state.fetchStatus = 'resolved';
	state.fetchError = null;
};

let setError = (state, action) => {
	state.fetchStatus = 'rejected';
	state.fetchError = action.payload;
};

let employees = localStorage.getItem('employeeList') ? JSON.parse(localStorage.getItem('employeeList')) : [];

let employeeSlice = createSlice({
	name: 'employeeSlice',
	initialState: {
		employees,
		fetchStatus: null,
		fetchError: null 
	},
	reducers: {
		addEmployee (state, action) {
			state.employees = [action.payload.data, ...state.employees];
		},
		removeEmployee (state, action) {
			state.employees = state.employees.filter(employee => employee._id !== action.payload.id);
		},
		changeDetails (state, action) {
			let filterEmployees = state.employees.filter(employee => employee._id !== action.payload.data._id);
			state.employees = [action.payload.data, ...filterEmployees];
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchEmployeeList.pending, setPending)
			.addCase(fetchAddEmployee.pending, setPending)
			.addCase(fetchRemoveEmployee.pending, setPending)
			.addCase(fetchChangeDetails.pending, setPending)

			.addCase(fetchEmployeeList.fulfilled, (state, action) => {
				state.fetchStatus = 'resolved';
				state.employees = action.payload.officers;
				state.fetchError = null;
			})

			.addCase(fetchAddEmployee.fulfilled, setFulfilled)
			.addCase(fetchRemoveEmployee.fulfilled, setFulfilled)
			.addCase(fetchChangeDetails.fulfilled, setFulfilled)

			.addCase(fetchEmployeeList.rejected, setError)
			.addCase(fetchAddEmployee.rejected, setError)
			.addCase(fetchRemoveEmployee.rejected, setError)
			.addCase(fetchChangeDetails.rejected, setError)
	}
});

let {addEmployee, removeEmployee, changeDetails } = employeeSlice.actions;

export default employeeSlice.reducer;
