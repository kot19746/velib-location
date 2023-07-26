import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { fetchCheckAuth } from '../store/authSlice';

import Header from '../header/Header';
import Footer from '../footer/Footer';

import css from './Layout.module.scss';


function Layout() {

	let dispatch = useDispatch();

	useEffect(() => {
		if(localStorage.getItem('token')){
			dispatch(fetchCheckAuth())
		}
	}, [dispatch]);

	return (
		<>
			<Header />
			<main className={css.main__wrapper}>
				<Outlet />
			</main>
			<Footer />
		</>
	)
}

export default Layout;