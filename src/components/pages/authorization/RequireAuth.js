import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

function RequireAuth ({children}) {
	let location = useLocation();
	let auth = localStorage.getItem('token') ? true : false;

	if(!auth) {
		return <Navigate to='/auth' state={{from: location}} />
	}

	return children;
}

export default RequireAuth;
