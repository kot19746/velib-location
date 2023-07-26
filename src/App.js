import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import TheftMessageForm from './components/pages/theftpages/TheftMessageForm';
import TheftsRecords from './components/pages/theftpages/TheftsRecords';
import TheftDetails from './components/pages/theftpages/TheftDetails';
import EmployeeRegistration from './components/pages/employeepages/employeeRegistration';
import EmployeeList from './components/pages/employeepages/EmployeeList';
import EmployeeDetails from './components/pages/employeepages/EmployeeDetails';
import RegistrationForm from './components/pages/registration/RegistrationForm';
import AuthPage from './components/pages/authorization/AuthPage';
import RequireAuth from './components/pages/authorization/RequireAuth';
import NotFoundPage from './components/pages/page404/NotFoundPage';

import css from './App.module.scss';


function App() {
  return (
    <div className={css.container}>
      <Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<TheftMessageForm />} />
					<Route path='theftrecords' element={
						<RequireAuth>
							<TheftsRecords />
						</RequireAuth>
					}/>
					<Route path='theftrecords/:_id' element={
						<RequireAuth>
							<TheftDetails />
						</RequireAuth>
					}/>
					<Route path='employeelist' element={
						<RequireAuth>
							<EmployeeList />
						</RequireAuth>
					}/>
					<Route path='employeelist/:_id' element={
						<RequireAuth>
							<EmployeeDetails />
						</RequireAuth>
					}/>
					<Route path='newemployee' element={
						<RequireAuth>
							<EmployeeRegistration />
						</RequireAuth>
					}/>
					<Route path='registration' element={<RegistrationForm />} />
					<Route path='auth' element={<AuthPage />} />
					<Route path='*' element={<NotFoundPage />} />
				</Route>
			</Routes>
    </div>
  );
}

export default App;
