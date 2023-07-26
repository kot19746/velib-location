import React from 'react';

function Button({type = 'submit', label, disabled, className, onClick}) {
	return (
		<>
			<button
				type={type}
				className={className}
				onClick={onClick}
				disabled={disabled}
			>
				{label}
			</button>
		</>
	)
}

export default Button;
