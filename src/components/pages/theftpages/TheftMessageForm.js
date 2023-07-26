import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { fetchAddTheftCase, fetchNewTheftCase, bikeType, bikeColor } from '../../store/theftSlice';
import { fetchEmployeeList } from '../../store/employeeSlice';

import { Formik, Form } from 'formik';
import FormControl from '../forms/FormControl';
import { theftMessageSchema } from '../forms/schema';

import Button from '../Button';
import ModalWindow from '../ModalWindow';

import css from './TheftStyles.module.scss';


function TheftMessageForm() {
	let location = useLocation();
	let navigate = useNavigate();

	let dispatch = useDispatch();
	let { token } = useSelector(state => state.auth);
	let {fetchStatus, fetchError} = useSelector(state => state.theftRecords);
	let approvedEmployee = useSelector(state => state.employeeList.employees).filter(employee => employee.approved);

	let [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);
	
	let officerList = [{key: 'Sélectionnez dans la liste', value: ''}, ...approvedEmployee.map(employee => (
		{key: `${employee.lastName} ${employee.firstName}`, value: employee._id}))];

	let initialValues = {
		licenseNumber: '',
		ownerFullName: '',
		type: '',
		color: '',
		date: null,
		description: '',
		officer: ''
	};

	let onSubmit = (values, {resetForm, setStatus}) => {
		try {
			token ? dispatch(fetchAddTheftCase(values)) : dispatch(fetchNewTheftCase(values));
			resetForm();
			setModalWindowIsOpen(!modalWindowIsOpen);
		}
		catch(error) {
			setStatus({
				msg: `Erreur de traitement des données ${error.message}!`
			})
		}
	};

	let goBack = () => navigate(location.state?.pathname ?? '/');

	let toggleModal= () => {
    setModalWindowIsOpen(!modalWindowIsOpen);
		goBack();
  };

	useEffect(() => {
		if(token){
			dispatch(fetchEmployeeList())
		}
	},[token, dispatch]);


	return (
		<>
			<div className={`form__intro ${css.theft__intro}`}>
				<p className='form__intro-text'>
					Velib est le plus grand réseau de location de vélos en Ile-de-France
					<br/>
					Le plus grand choix de vélos traditionnels et électriques dans la région parisienne.
					<br/>
					<br/>
					Si votre vélo à été volé, remplissez le formulaire et appuiez sur le button &#171;Envoyer&#187;.
				</p>
			</div>
			<div className={`form-mobile ${css.theft__tablet}`}>Rapport de vol</div>
			<Formik
				initialValues = {initialValues}
				validationSchema = {theftMessageSchema}
				onSubmit = {onSubmit}
				enableReinitialize
			>
			{formikProps => {
				let { isSubmitting, status, dirty, handleReset, errors, touched } = formikProps;
				return (
					<Form className={`form ${css.theft__form}`}>
						{status && status.msg && <p style={{color: "#fff"}}>{status.msg}</p>}
						<div className={css.theft__block}>
							<FormControl
								control='input'
								name='licenseNumber'
								label='Numéro de licence'
								errors={errors}
								touched={touched}
							/>
							<div className='data_reg'>
								<FormControl
									control='date'
									name='date'
									label='La date du vol'
									maxDate={new Date()}
									placeholderText='Choisisez la date'
									errors={errors}
									touched={touched}
								/>
							</div>
						</div>
						<FormControl
							control='input'
							name='ownerFullName'
							label='Nom, prénom de locataire'
							errors={errors}
							touched={touched}
						/>
						<div className={css.theft__block}>
							<FormControl
								control='select'
								type='select'
								name='type'
								options={bikeType}
								label='Type de vélo'
								errors={errors}
								touched={touched}
							/>
							<FormControl
								control='select'
								type='select'
								name='color'
								options={bikeColor}
								label='Couleur du vélo'
								errors={errors}
								touched={touched}
							/>
						</div>
						<FormControl
							control='textarea'
							name='description'
							label='Infos supplémentaires'
							placeholder=''
							errors={''}
							touched={''}
						/>
						{token ? 
							<FormControl
								control='select'
								type='select'
								name='officer'
								options={officerList}
								label='Responsable'
								errors={errors}
								touched={touched}
							/> : ''
						}
						<div className='form__buttons'>
							<Button 
								type='button'
								label='Effacer' 
								disabled={isSubmitting || !dirty} 
								onClick={handleReset}
								className='form__btn'
							/>
							<Button 
								label='Envoyer'
								disabled={isSubmitting || !dirty}
								className='form__btn'
							/>
						</div>
					</Form>
					)
				}
			}
			</Formik>
			<ModalWindow
				isOpen={modalWindowIsOpen}
				onRequestClose={toggleModal}
				title = {fetchStatus === 'loading' ? 'Envoi de données...' : fetchStatus === 'resolved' ? 'Rapport de vol envoyé' : ''}
				text = {fetchStatus === 'resolved' ? 'Merci pour votre message!' : ''}
				textErr =  {fetchError ? `Erreur: ${fetchError} !` : ''}
				onClick = {toggleModal}
			/>		
		</>
	)
}

export default TheftMessageForm;