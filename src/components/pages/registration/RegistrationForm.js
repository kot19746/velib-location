import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { fetchSignUp } from '../../store/authSlice';

import { Formik, Form } from 'formik';
import FormControl from '../forms/FormControl';
import { signUpSchema } from '../forms/schema';

import Button from '../Button';
import ModalWindow from '../ModalWindow';


function RegistrationForm() {
	let navigate = useNavigate();

	let dispatch = useDispatch();
	let {fetchStatus, fetchError} = useSelector(state => state.auth);
	
	let [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);

	let initialValues = {
		email: '',
		password: '',
		firstName: '',
		lastName: ''
	};

	let onSubmit = (values, {resetForm, setStatus}) => {
		try {
			dispatch(fetchSignUp(values));
			resetForm();
			setModalWindowIsOpen(!modalWindowIsOpen)
		}
		catch(err) {
			setStatus({
        msg: `Erreur de traitement des données: ${err.message}!`
      })
		}
	};
	
	let toggleModal= () => {
    setModalWindowIsOpen(!modalWindowIsOpen);
		navigate('/');
  };

	return (
		<>
			<div className='form__intro'>
				<p className='form__intro-text'>
				Pour utiliser le système d'information
				vous devez vous inscrire.
					<br/>
					<br/>
					Veuillez remplir tous les champs du formulaire et
					appuiez le bouton &#171;Confirmer&#187;.
				</p>
			</div>
			<div className='form-mobile'>Inscription d'un employé</div>
			<Formik
				initialValues = {initialValues}
				validationSchema = {signUpSchema}
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
								onClick={handleReset}
								className='form__btn'
								disabled={isSubmitting || !dirty} 
							/>
							<Button
								label='Confirmer' 
								className='form__btn'
								disabled={isSubmitting || !dirty}
							/>
						</div>
					</Form>
					)
				}
			</Formik>
			<ModalWindow
				isOpen={modalWindowIsOpen}
				onRequestClose={toggleModal}
				title = {fetchStatus === 'loading' ? 'Renouvelement des données...' : fetchStatus === 'resolved' ? 'Données sont envoyées' : ''}
				textErr =  {fetchError ? `Erreur: ${fetchError} !` : ''}
				onClick = {toggleModal}
			/>		
		</>
	)
}

export default RegistrationForm;