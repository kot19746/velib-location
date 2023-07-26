import React from 'react'

function ErrorText({children}) {
	let errorText = children;
	return (
		<div className='form__error'>
			{errorText}
		</div>
	)
}

export default ErrorText;