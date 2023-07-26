import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSignIn } from '../../store/authSlice';

import { Formik, Form } from 'formik';
import FormControl from '../forms/FormControl';
import { signInSchema } from '../forms/schema';

import Button from '../Button';
import ModalWindow from '../ModalWindow';


function AuthPage() {

	let location = useLocation();
	let navigate = useNavigate();
	let [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);

	let dispatch = useDispatch();
	let { token, fetchStatus, fetchError } = useSelector(state => state.auth);

	
	let fromPage = location.state?.from?.pathname ?? '/';

	let initialValues = {
		email: '',
		password: ''
	};

	let onSubmit = (values, {resetForm, setStatus}) => {
		try {
			dispatch(fetchSignIn(values))
			resetForm()
			setModalWindowIsOpen(!modalWindowIsOpen);
		}
		catch(err) {
			setStatus({
        msg: `Erreur des données : ${err.message}`
      })
			return err.message;
		}
	}
	
	let toggleModal = () => {
    setModalWindowIsOpen(!modalWindowIsOpen);
		navigate(fromPage, {replace: true});
  };

	return (
		<>
			<div className='form__intro'>
				<p className='form__intro-text'>
				Pour accéder aux systèmes d'information
                une autorisation est requise.
					<br/>
					<br/>
					Veuillez remplir tous les champs du formulaire et
                    appuiez sur le bouton &#171;Confirmer&#187;.
				</p>
			</div>
			<div className='form-mobile'>S'identifier</div>
			<Formik
				initialValues = {initialValues}
				validationSchema = {signInSchema}
				onSubmit = {onSubmit}
			>
				{formikProps => {
					let { status, dirty, errors, touched } = formikProps;
					return (
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
							<Button 
								label='Confirmer'
								disabled={!formikProps.isValid || !dirty}
								className='form__btn'
							/>
						</Form>
						)
					}
				}
			</Formik>
			<ModalWindow
				isOpen={modalWindowIsOpen}
				onRequestClose={toggleModal}
				title = {fetchStatus === 'loading' ? 'Vérification des données...' : fetchStatus === 'resolved' && token ? 'Autorisation a réussi' : ''}
				textErr =  {fetchError ? `Erreur d'autorisation: ${fetchError} !` : ''}
				onClick = {toggleModal}
			/>
		</>
	)
}

export default AuthPage;