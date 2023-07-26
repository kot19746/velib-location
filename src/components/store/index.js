import { configureStore } from '@reduxjs/toolkit';
import employeeSlice from './employeeSlice';
import theftSlice from './theftSlice';
import authSlice from './authSlice';


const store = configureStore({
	reducer: {
		employeeList: employeeSlice,
		theftRecords: theftSlice,
		auth: authSlice,
	}
});

export default store;