import React from 'react';
import PropTypes from 'prop-types';

import { Field, ErrorMessage } from 'formik';
import ErrorText from './ErrorText';


function Input({label, id, name, type = 'text', errors, touched, ...rest}) {
	return (
		<div className='input'>
			<label htmlFor={name} className='input__label'>{label}</label>
			{}
			<Field  
				type='password'
				autoComplete='off'
				value='' 
				style={{display: 'none'}} 
				tabIndex="-1" 
			/>
			{}
			<Field 
				id={id ?? name} 
				name={name} 
				type={type} 
				{...rest}
				autoComplete='off' 
				className={`input__value ${errors[name] && touched[name] ? 'input__value_Err' : ''}`}
			/>
			<ErrorMessage name={name} component={ErrorText} />
		</div>
	)
}

Input.propTypes = {
	label: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
	type: PropTypes.string
};


export default Input;