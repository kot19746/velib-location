import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientId } from '../pages/authorization/clientId';
import { authHeader } from '../pages/authorization/authHeader';

const API_URL = 'https://sf-final-project-be.herokuapp.com/api/cases/'; 
const API_URL_PUBLIC = 'https://sf-final-project-be.herokuapp.com/api/public/report';

export let status = [
	{key: 'Le status', value: ''},
	{key: 'nouvelle', value: 'new'},
	{key: 'en traitement', value: 'in_progress'},
	{key: 'terminé', value: 'done'},
];

export let bikeType = [
	{key: 'Type de vélo', value: ''},
	{key: 'mecanique', value: 'general'},
	{key: 'éléctrique', value: 'sport'},
];

export let bikeColor = [
	{key: 'Couleur du vélo', value: ''},
	{key: 'gris', value: 'grey'},
	{key: 'bleu', value: 'blue'},
	{key: 'vert', value: 'green'},
];

export let fetchTheftRecords = createAsyncThunk(
	'theftCase/fetchTheftRecords',
	async function (_, {rejectWithValue}) {
		try {
			let response = await fetch(`${API_URL}`, {
				method: 'GET',
				headers: authHeader()
			});

			if(!response.ok) {
				throw new Error('Error of getting data')
			}

			let theftData = await response.json();
			localStorage.setItem('thefCases', JSON.stringify(theftData.data));
			return theftData;
			
		} catch (error) {
			 return rejectWithValue(error.message)
		}
	}
);

export let fetchAddTheftCase = createAsyncThunk(
	'theftCase/fetchAddTheftCase',
	async function (values, {rejectWithValue, dispatch}) {
		let ownerFullName = values.ownerFullName.split(' ').map(elem => elem[0].toUpperCase() + elem.slice(1).toLowerCase()).join(' ');
		let description = values.description.toLowerCase();
		
		try {
			let theftCase = {
				licenseNumber: values.licenseNumber,
				ownerFullName,
				type: values.type,
				color: values.color,
				date: values.date,
				officer: values.officer,
				description,
			};
			
			let response = await fetch(`${API_URL}`, {
				method: 'POST',
				headers: authHeader(),
				body: JSON.stringify(theftCase)
			});

			if(!response.ok) {
				throw new Error('Error of adding data')
			}

			let addNewTheftCase = await response.json();
			dispatch(addTheftCase(addNewTheftCase));
			
			
		} catch (error) {
			 return rejectWithValue(error.message)
		}
	}
);

export let fetchNewTheftCase = createAsyncThunk(
	'theftCase/fetchNewTheftCase',
	async function (values, {rejectWithValue, dispatch}) {
		let ownerFullName = values.ownerFullName.split(' ').map(elem => elem[0].toUpperCase() + elem.slice(1).toLowerCase()).join(' ');
		let description = values.description.toLowerCase();

		try {
			let theftCase = {
				licenseNumber: values.licenseNumber,
				ownerFullName,
				type: values.type,
				clientId,
				color: values.color,
				date: values.date,
				description,
			};

			let response = await fetch(`${API_URL_PUBLIC}`, {
				method: 'POST',
				headers: authHeader(),
				body: JSON.stringify(theftCase)
			});

			if(!response.ok) {
				throw new Error('Error of adding data')
			}

			let newTheftCase = await response.json();
			dispatch(addTheftCase(newTheftCase));
			
			
		} catch (error) {
			 return rejectWithValue(error.message)
		}
	}
);

export let fetchTheftRemove = createAsyncThunk(
	'theftCase/fetchTheftRemove',
	async function (id, {rejectWithValue, dispatch}) {
		try {
			let response = await fetch(`${API_URL}/${id}`, {
				method: 'DELETE',
				headers: authHeader()
			});

			if(!response.ok) {
				throw new Error('Error of removing data')
			}

			dispatch(removeTheftCase({id}))
			
		} catch (error) {
			 return rejectWithValue(error.message)
		}
	}
);

export let fetchChangeTheftCase = createAsyncThunk(
	'theftCase/fetchChangeTheftCase',
	async function (values, {rejectWithValue, dispatch}) {
		let newTheftDate = values.newTheftDate ?? values.date;
		let ownerFullName = values.ownerFullName.split(' ').map(elem => elem[0].toUpperCase() + elem.slice(1).toLowerCase()).join(' ');
		let description = values.description ? values.description.toLowerCase() : '';
		let resolution = values.resolution ? values.resolution.toLowerCase() : '';

		try {
			let response = await fetch(`${API_URL}${values._id}`, {
				method: 'PUT',
				headers: authHeader(),
				body: JSON.stringify({
					status: values.status,
					licenseNumber: values.licenseNumber,
					ownerFullName: ownerFullName,
					type: values.type,
					color: values.color,
					date: newTheftDate,
					officer: values.officer,
					description,
					resolution
				})
			});

			if(!response.ok) {
				throw new Error('Error of updating data')
			}

			let updatedData = await response.json();
			dispatch(changeTheftCase(updatedData));
			
			
		} catch (error) {
			 return rejectWithValue(error.message)
		}
	}
);

let setPending = (state, action) => {
	state.fetchStatus = 'loading';
	state.fetchError = null;
};

let setFulfilled = (state, action) => {
	state.fetchStatus = 'resolved';
	state.fetchError = null;
};

let setError = (state, action) => {
	state.fetchStatus = 'rejected';
	state.fetchError = action.payload;
};

let theftCase = localStorage.getItem('thefCases') ? JSON.parse(localStorage.getItem('thefCases')) : [];

let theftSlice = createSlice({
	name: 'theftSlice',
	initialState: {
		theftCase,
		fetchStatus: null,
		fetchError: null
	},
	reducers: {
		addTheftCase(state, action) {
			state.theftCase.push(action.payload.data);
		},
		removeTheftCase(state, action) {
			state.theftCase = state.theftCase.filter(theftCase => theftCase._id !== action.payload.id);
		},
		changeTheftCase(state, action) {
			let filterCases = state.theftCase.filter(elem => elem._id !== action.payload.data._id);
			state.theftCase = [action.payload.data, ...filterCases];
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTheftRecords.pending, setPending)
			.addCase(fetchAddTheftCase.pending, setPending)
			.addCase(fetchNewTheftCase.pending, setPending)
			.addCase(fetchTheftRemove.pending, setPending)
			.addCase(fetchChangeTheftCase.pending, setPending)
			
			.addCase(fetchTheftRecords.fulfilled, (state, action) => {
				state.fetchStatus = 'resolved';
				state.theftCase = action.payload.data;
				state.fetchError = null;
			})
			.addCase(fetchAddTheftCase.fulfilled, setFulfilled)
			.addCase(fetchNewTheftCase.fulfilled, setFulfilled)
			.addCase(fetchTheftRemove.fulfilled, setFulfilled)
			.addCase(fetchChangeTheftCase.fulfilled, setFulfilled)

			.addCase(fetchTheftRecords.rejected, setError)
			.addCase(fetchAddTheftCase.rejected, setError)
			.addCase(fetchNewTheftCase.rejected, setError)
			.addCase(fetchTheftRemove.rejected, setError)
			.addCase(fetchChangeTheftCase.rejected, setError)
	}
});

let { addTheftCase, removeTheftCase, changeTheftCase } = theftSlice.actions;

export default theftSlice.reducer;