import React from 'react';
import PropTypes from 'prop-types';

import { Field, ErrorMessage } from 'formik';
import ErrorText from './ErrorText';

function Textarea({label, id, name, errors, touched, ...rest}) {
	return (
		<div className='input'>
			<label htmlFor={name} className='input__label'>{label}</label>
			<Field 
				as='textarea'
				id={id ?? name}  
				name={name} 
				{...rest} 
				autoComplete='off'
				className={`input__value textarea ${errors[name] && touched[name] ? 'input__value_Err' : ''}`}
			/>
			<ErrorMessage name={name} component={ErrorText} />
		</div>
	)
}

Textarea.propTypes = {
	label: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
};

export default Textarea;