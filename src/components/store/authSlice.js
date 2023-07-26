import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientId } from '../pages/authorization/clientId';
import { authHeader } from '../pages/authorization/authHeader';

const API_URL = 'https://sf-final-project-be.herokuapp.com/api/auth'; 

export let fetchSignUp = createAsyncThunk(
	'user/fetchSignUp',
	async function (values, {rejectWithValue}) {
		let firstName = values.firstName && values.firstName[0].toUpperCase() + values.firstName.slice(1).toLowerCase();
		let lastName = values.lastName && values.lastName[0].toUpperCase() + values.lastName.slice(1).toLowerCase();
		try {
			let user = {
				email: values.email.toLowerCase(),
				password: values.password,
				clientId: clientId,
				firstName,
				lastName,
				approved: false,
			};

			let response = await fetch(`${API_URL}/sign_up`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});

			if(!response.ok) {
				throw new Error('Error of processing data')
			}

			
		}
		catch(error) {
			return rejectWithValue(error.message)
		}
	}
);

export let fetchSignIn = createAsyncThunk(
	'user/fetchSignIn',
	async function (values, {rejectWithValue}) {
		let email = values.email.toLowerCase();
		let password = values.password;
		try {
			let response = await fetch(`${API_URL}/sign_in`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({email, password})
			});
			
			if(response.status === 401 || !response.ok) {
				throw new Error(`${response.status} ${response.statusText}`)
			}

			let signInData = await response.json();
			localStorage.setItem('token', signInData.data.token);
			
			return signInData;
		}
		catch(error) {
			if (error.status === 'ERR' && error.errCode) {
        return rejectWithValue(error.message)
      } else {
        return rejectWithValue(error.message)
			}
		}
	}	
);

export let fetchCheckAuth = createAsyncThunk(
	'user/fetchCheckAuth',
	async function (_, {rejectWithValue, getState}) {
		try {
			let response = await fetch(API_URL, {
				method: 'GET',
				headers: authHeader()
			});

			if(response.status === 401) {
				let values = getState().auth.user;
				return fetchSignIn(values);
			}

			if(!response.ok) {
				throw new Error(`${response.status} ${response.statusText}`)
			}

			let checkData = await response.json();
			localStorage.setItem('token', checkData.data.token)
			return checkData;
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

let setFulfilled = (state, action) => {
	state.fetchStatus = 'resolved';
	state.user = action.payload.data.user;
	state.token = action.payload.data.token;
};

let setError = (state, action) => {
	state.fetchStatus = 'rejected';
	state.fetchError = action.payload;
}; 

let token = localStorage.getItem('token') ? localStorage.getItem('token') : null;

let authSlice = createSlice({
	name: 'authSlice',
	initialState: {
		user: null,
		token,
		fetchStatus: null,
		fetchError: null 
	},
	reducers: {
		logout (state) {
			localStorage.removeItem('token');
			localStorage.removeItem('employeeList')
			localStorage.removeItem('thefCases')
			state.user = null;
			state.token = null;
			state.fetchStatus = null;
			state.fetchError = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSignUp.pending, setPending)
			.addCase(fetchSignIn.pending, setPending)
			.addCase(fetchCheckAuth.pending, setPending)

			.addCase(fetchSignUp.fulfilled, (state) => {
				state.fetchStatus = 'resolved';
			}) 
			.addCase(fetchSignIn.fulfilled, setFulfilled)
			.addCase(fetchCheckAuth.fulfilled, setFulfilled) 

			.addCase(fetchSignUp.rejected, setError)
			.addCase(fetchSignIn.rejected, (state, action) => {
				state.fetchStatus = 'rejected';
				state.fetchError = action.payload;
				state.user = null;
			})
			.addCase(fetchCheckAuth.rejected, setError)	
	}
});
export let { logout } = authSlice.actions;

export default authSlice.reducer;