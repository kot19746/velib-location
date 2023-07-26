import React from 'react';
import PropTypes from 'prop-types';

import DateView from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from "date-fns/locale/ru";

import { Field, ErrorMessage } from 'formik';
import ErrorText from './ErrorText';


function Date({label, name, errors, touched, ...rest}) {
	return (
		<div className='data'>
			<label htmlFor={name} className='data__label'>{label}</label>
			<Field id={name} name={name}>
				{({form, field}) => {
					let { setFieldValue } = form;
					let { value } = field;
					return (
						<DateView 
							{...field}
							{...rest}
							dateFormat="dd.MM.yyyy"
							autoComplete='off'
							selected={value}
							onChange={value => setFieldValue(name, value)}
							locale={ru}
							closeOnScroll={true}
							className={`react-datepicker__day--outside-monthred-border data__view ${errors[name] && touched[name] ? 'data__view_Err' : ''}`}
						/>
					)
				}}
			</Field>
			<ErrorMessage name={name} component={ErrorText} />
		</div>
	)
}

Date.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
};

export default Date;