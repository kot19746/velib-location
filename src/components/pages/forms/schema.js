import * as Yup from 'yup';

export let signUpSchema = Yup.object({
	email: Yup.string()
						.email('email invalide')
						.required('Doit être rempli'),
	password: Yup.string()
							.min(4, 'Au moins 4 caractères')
							.required('Doit être rempli'),
	clientId: Yup.string(),
	firstName: Yup.string(),
	lastName: Yup.string(),
	approved: Yup.boolean()
});


export let signInSchema = Yup.object({
	email: Yup.string()
					.email('email invalide')
					.required('Doit être rempli'),
	password: Yup.string()
							.min(4, 'Mot de passe trop court')
							.required('Doit être rempli'),
});


export let newEemployeeSchema = Yup.object({
	email: Yup.string()
						.email('email invalide')
						.required('Doit être rempli'),
	password: Yup.string()
							.min(4, 'Au moins 4 caractères')
							.required('Doit être rempli'),
	firstName: Yup.string(),
	lastName: Yup.string(),
	approved: Yup.boolean()
});


export let employeeDetailsSchema = Yup.object({
	password: Yup.string()
						.min(4, 'Au moins 4 caractères')
						.required('Doit être rempli'), 
	firstName: Yup.string()
					.typeError('Doit être une chaîne')
					.min(2, 'Le prénom saisi est trop court')
					.required('Doit être rempli'), 
	lastName: Yup.string()
					.min(2, 'Le nom saisi est trop court')
					.required('Doit être rempli'),
	approved: Yup.boolean()	
});


export let theftMessageSchema = Yup.object({
	licenseNumber: Yup.string().required('Doit être rempli'),
	ownerFullName: Yup.string()
									.min(6, 'Le nom saisi est trop court')
									.required('Doit être rempli'),
	type: Yup.string().required('Choisissez un modèle'),								
	color: Yup.string().nullable(),
	date: Yup.date()
					.nullable()
					.required('Choisissez la date'),
	officer: Yup.string(),				
	description: Yup.string().nullable()
});


export let theftRecordSchema = Yup.object({
	// id: Yup.string(),
	status:  Yup.string().required('Choisissez le status'),
	licenseNumber: Yup.string().required('Doit être rempli'),
	type: Yup.string().required('choisissez le type'),
	ownerFullName: Yup.string()
									.min(6, 'Le nom saisi est trop court')	
									.required('Doit être rempli'),
	clientId: Yup.string(),
	createdAt: Yup.date().nullable(),
	updatedAt: Yup.date().nullable(),
	color: Yup.string().nullable(),
	date: Yup.date(),
	newTheftDate: Yup.date().nullable(),
	description: Yup.string().nullable(),
	resolution: Yup.string()
								.nullable()
								.when('status', {
									is: 'done',
									then: Yup.string().nullable().required('Laissez une commentaire')
								}),
	officer: Yup.string().nullable()
});