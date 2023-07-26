import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Checkbox from './Checkbox';
import Date from './Date';


function FormControl({control, ...rest}) {
	switch(control) {
		case 'input': return <Input {...rest} />
		case 'textarea': return <Textarea {...rest} />
		case 'select': return <Select {...rest} />
		case 'checkbox': return <Checkbox {...rest} />
		case 'date': return <Date {...rest} />
		default: return null
	}
}

FormControl.propTypes = {
	control: PropTypes.string.isRequired,
};

export default FormControl;