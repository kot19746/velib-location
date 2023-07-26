import React from 'react';
import PropTypes from 'prop-types';

import { Field, ErrorMessage } from 'formik';
import ErrorText from './ErrorText';


function Select({label, id, name, options, errors, touched, ...rest}) {
	return (
		<div className='select'>
			<label htmlFor={name} className='select__label'>{label}</label>
			<Field 
				as='select' 
				id={id ?? name}  
				name={name}
				{...rest} 
				className={`select__value ${errors[name] && touched[name] ? 'select__value_Err' : ''}`}
			>
			{options.map(option => (
				<option 
					key={option.value} 
					value={option.value} 
					label={option.key} 
					className='select__option'
				/>)
				)
			}
			</Field>
			<ErrorMessage name={name} component={ErrorText} />
		</div>
	)
}

Select.propTypes = {
	label: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Select;