import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { fetchAddEmployee } from '../../store/employeeSlice';

import { Formik, Form } from 'formik';
import FormControl from '../forms/FormControl';
import { newEemployeeSchema } from '../forms/schema';

import Button from '../Button';
import ModalWindow from '../ModalWindow';


function EmployeeRegistration() {

	let navigate = useNavigate();

	let dispatch = useDispatch();
	let {fetchStatus, fetchError} = useSelector(state => state.employeeList);

	let [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);

	let initialValues = {
		email: '',
		password: '',
		firstName: '',
		lastName: '',
	};

	let onSubmit = (values, {resetForm, setStatus}) => {
		try {
			dispatch(fetchAddEmployee(values));
			resetForm();
			setModalWindowIsOpen(!modalWindowIsOpen)
		}
		catch(error) {
			setStatus({
        msg: `Erreur de traitement des données: ${error.message}!`
      })
		}
	};
	
	let toggleModal= () => {
    setModalWindowIsOpen(!modalWindowIsOpen);
		navigate('/employeelist');
  };

	return (
		<>
			<div className='form__intro'>
				<p className='form__intro-text'>
					Pour ajouter un employé 
					<br/>
					vous devez remplir le formulaire.
					<br/>
					<br/>
					Veuillez remplir tous les champs du formulaire et
					<br/> 
					appuiez le bouton &#171;Confirmer&#187;.
				</p>
			</div>
			<div className='form-mobile'>Inscription d'un employé</div>
			<Formik
				initialValues = {initialValues}
				validationSchema = {newEemployeeSchema}
				onSubmit = {onSubmit}
			>
				{({isSubmitting, handleReset, status, dirty, errors, touched}) => (
					<Form className='form'>
						{status && status.msg && <p style={{color: "#fff"}}>{status.msg}</p>}
						<FormControl 
							control='input' 
							type='email' 
							name='email' 
							label='Email'
							errors={errors}
							touched={touched} 
						/>
						<FormControl 
							control='input' 
							type='password' 
							name='password' 
							label='Mot de passe'
							errors={errors}
							touched={touched} 
						/>
						<FormControl 
							control='input' 
							name='firstName' 
							label='Prénom'
							errors={errors}
							touched={touched} 
						/>
						<FormControl
							control='input'
							name='lastName'
							label='Nom'
							errors={errors}
							touched={touched}
						/>
						<div className='form__buttons'>
							<Button 
								type='button'
								label='Efacer'
								disabled={isSubmitting || !dirty}
								className='form__btn'
								onClick={handleReset}
							/>
							<Button
								label='Confirmer' 
								disabled={isSubmitting || !dirty}
								className='form__btn'
							/>
						</div>
					</Form>
					)
				}
			</Formik>
			<ModalWindow
				isOpen={modalWindowIsOpen}
				onRequestClose={toggleModal}
				title = {fetchStatus === 'loading' ? 'Renouvelement des données...' : fetchStatus === 'resolved' ? 'Données de nouveau employé enregistrés' : ''}
				textErr =  {fetchError ? `Erreur: ${fetchError} !` : ''}
				onClick = {toggleModal}
			/>		
		</>
	)
}

export default EmployeeRegistration;