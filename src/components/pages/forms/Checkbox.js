import React from 'react';

import { Field, ErrorMessage } from 'formik';
import ErrorText from './ErrorText';

function Checkbox({label, name, ...rest}) {
	return (
		<div className='checkbox'>
			<label className='checkbox__label'>{label}</label>
			<Field id={name} name={name}>
				{({field, form}) => {
					let { value } = field;
					return (
						<Field 
							type='checkbox' 
							{... rest} 
							checked={value} 
							{...field} 
							className='checkbox__box'
						/>
					)}
				}
			</Field>
			<ErrorMessage name={name} component={ErrorText} />
		</div>
	)
}

export default Checkbox;