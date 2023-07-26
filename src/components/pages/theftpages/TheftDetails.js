import React, { useState} from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChangeTheftCase, status, bikeType, bikeColor } from '../../store/theftSlice';

import { Formik, Form } from 'formik';
import FormControl from '../forms/FormControl';
import { theftRecordSchema } from '../forms/schema';

import Button from '../Button';
import ModalWindow from '../ModalWindow';

import css from './TheftStyles.module.scss';


function TheftDetails() {
	
	let navigate = useNavigate();
	let {_id} = useParams();

	let [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);
	
	let dispatch = useDispatch();
	let {theftCase, fetchStatus, fetchError} = useSelector(state => state.theftRecords);
	let savedValues = theftCase.find(item => item._id === _id);

	let approvedEmployee = useSelector(state => state.employeeList.employees).filter(employee => employee.approved);
	
	let officerList = [{key: 'Sélectionnez dans la liste', value: ''}, ...approvedEmployee.map(employee => (
		{key: `${employee.lastName} ${employee.firstName}`, value: employee._id}))];

	if(!savedValues) {
		return <Navigate to='/*' />
	}

	let toggleModal= () => {
    setModalWindowIsOpen(!modalWindowIsOpen);
		navigate('/theftrecords');
  };

	let onSubmit = (values, {setSubmitting}) => {
		try {
			dispatch(fetchChangeTheftCase(values));
			setSubmitting(false);
			setModalWindowIsOpen(!modalWindowIsOpen);
		}
		catch(err) {
			console.error(err.message)
		}
	}
  
	return (
		<div className={css.theftdetails}>
			<div className={css.theftrecords__title_container}>
				<h1 className={`${css.theftrecords__title} ${css.theftdetails__title}`}>Rapport de vol {_id}</h1>
				<div className={`${css.theftrecords__info} ${css.theftdetails__info}`}>
					ClientID: <span>{savedValues.clientId}</span>
				</div>
			</div>
			{fetchStatus === 'loading' && <h3 className={css.theftdetails__msg}>Chargement de données...</h3>}
			{fetchError && <h3 className={css.theftdetails__msgErr}>Erreur de chargement de données: {fetchError} !</h3>}
			<Formik
				initialValues = {{...savedValues, newTheftDate: null}}
				validationSchema = {theftRecordSchema}
				onSubmit = {onSubmit}
			>
			{({values, isSubmitting, dirty, errors, touched}) => {
				return (
					<Form>
						<table className={css.theftdetails__table_desktop}>
							<tbody>
								<tr>
									<td className={css.theftdetails__detail}>Status:</td>
									<td className={css.theftdetails__secondtd}>
										<FormControl 
											control='select' 
											name='status' 
											options={status}
											errors={errors}
											touched={touched}  
										/>
									</td>
									<td className={css.theftdetails__tdspacer}></td>
									<td className={css.theftdetails__detail}>La date du vol:</td>
									<td>
										<FormControl 
											control='date' 
											name='newTheftDate' 
											maxDate={new Date()}
											disabled = {values.status === 'done'}
											placeholderText={new Date(savedValues.date).toLocaleDateString()}
											errors={''}
											touched={''} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Numéro de licence: </td>
									<td>
										<FormControl
											control='input'
											name='licenseNumber'
											disabled = {values.status === 'done'}
											errors={errors}
											touched={touched} 
										/>
									</td>
									<td className={css.theftdetails__tdspacer}></td>
									<td className={css.theftdetails__detail}>La date de creation: </td>
									<td className={css.theftdetails__detail_data}>
										{new Date(savedValues.createdAt).toLocaleDateString()}
									</td>
								</tr>
								<tr>
								<td className={css.theftdetails__detail}>Nom, prénom de locataire: </td>
									<td>
										<FormControl 
											control='input' 
											name='ownerFullName'
											errors={errors}
											touched={touched} 
											disabled = {values.status === 'done'} 
										/>
									</td>
									<td className={css.theftdetails__tdspacer}></td>
									<td className={css.theftdetails__detail}>La date de renouvellement: </td>
									<td className={css.theftdetails__detail_data}>
										{new Date(savedValues.updatedAt).toLocaleDateString()}
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Type de vélo: </td>
									<td>
										<FormControl 
											control='select' 
											name='type' 
											options={bikeType}
											errors={errors}
											touched={touched} 
											disabled = {values.status === 'done'}
										/>
									</td>
									<td className={css.theftdetails__tdspacer}></td>
									<td className={css.theftdetails__detail}>Couleur de vélo: </td>
									<td>
										<FormControl
											control='select'
											name='color'
											options={bikeColor}
											errors={''}
											touched={''} 
											disabled = {values.status === 'done'} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Info supplementaire: </td>
									<td colSpan="4">
										<FormControl 
											control='textarea' 
											name='description' 
											errors={''}
											touched={''}
											disabled = {values.status === 'done'} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Responsable: </td>
									<td>
										<FormControl 
											control='select' 
											type='select' 
											name='officer' 
											options={officerList}
											disabled = {values.status === 'done'}
											errors={''}
											touched={''} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Commentaire: </td>
									<td colSpan="4">
										<FormControl 
											control='textarea' 
											name='resolution'
											errors={errors}
											touched={touched}
											disabled = {values.status !== 'done'}
										/>
									</td>
								</tr>
							</tbody>
						</table>
						<table className={css.theftdetails__table_mobile}>
							<tbody>
								<tr>
									<td className={css.theftdetails__detail}>Status:</td>
									<td className={css.theftdetails__secondtd}>
										<FormControl 
											control='select'
											id='status2'
											name='status' 
											options={status}
											errors={errors}
											touched={touched}  
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>La date du vol:</td>
									<td>
										<FormControl 
											control='date'
											id='newTheftDate2'
											name='newTheftDate' 
											maxDate={new Date()}
											disabled = {values.status === 'done'}
											placeholderText={new Date(savedValues.date).toLocaleDateString()}
											errors={''}
											touched={''} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Numéro de licence: </td>
									<td>
										<FormControl
											control='input'
											id='licenseNumber2'
											name='licenseNumber'
											disabled = {values.status === 'done'}
											errors={errors}
											touched={touched} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>La date de creation: </td>
									<td className={css.theftdetails__detail_data}>
										{new Date(savedValues.createdAt).toLocaleDateString()}
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Nom, prénom de locataire: </td>
									<td>
										<FormControl 
											control='input'
											id='ownerFullName2'
											name='ownerFullName'
											errors={errors}
											touched={touched} 
											disabled = {values.status === 'done'} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>La date de renouvellement: </td>
									<td className={css.theftdetails__detail_data}>
										{new Date(savedValues.updatedAt).toLocaleDateString()}
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Type de vélo: </td>
									<td>
										<FormControl 
											control='select'
											id='type2' 
											name='type' 
											options={bikeType}
											errors={errors}
											touched={touched} 
											disabled = {values.status === 'done'}
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Couleur de vélo: </td>
									<td>
										<FormControl
											control='select'
											id='color2'
											name='color'
											options={bikeColor}
											errors={''}
											touched={''} 
											disabled = {values.status === 'done'} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Info supplementaire: </td>
									<td>
										<FormControl 
											control='textarea'
											id='description2' 
											name='description' 
											errors={''}
											touched={''}
											disabled = {values.status === 'done'} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Responsable: </td>
									<td>
										<FormControl 
											control='select' 
											type='select'
											id='officer2'  
											name='officer' 
											options={officerList}
											disabled = {values.status === 'done'}
											errors={''}
											touched={''} 
										/>
									</td>
								</tr>
								<tr>
									<td className={css.theftdetails__detail}>Commentaire: </td>
									<td>
										<FormControl 
											control='textarea'
											id='resolution2' 
											name='resolution'
											errors={errors}
											touched={touched}
											disabled = {values.status !== 'done'}
										/>
									</td>
								</tr>
							</tbody>
						</table>
						<Button
							label='Sauvegarder les modifications' 
							className={`form__btn ${css.theftdetails__btn}`}
							disabled={isSubmitting || !dirty}
						/>
						<Link to='/theftrecords' className={`form__btn ${css.theftdetails__btn}`}>Fermer</Link>
					</Form>
					)
				}
			}
			</Formik>
			<ModalWindow
				isOpen={modalWindowIsOpen}
				onRequestClose={toggleModal}
				title = {fetchStatus === 'loading' ? 'Mise à jour des données...' : fetchStatus === 'resolved' ? 'Données sont à jour' : ''}
				textErr =  {fetchError ? `Erreur: ${fetchError} !` : ''}
				onClick = {toggleModal}
			/>
		</div>		
	)
}

export default TheftDetails;