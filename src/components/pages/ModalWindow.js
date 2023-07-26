import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import Button from './Button';

Modal.setAppElement('#root');

function ModalWindow({isOpen, title, text, textErr, onRequestClose, onClick}) {
	return (
		<>
			<Modal
				isOpen = {isOpen}
				onRequestClose = {onRequestClose}
				shouldCloseOnOverlayClick = {false}
				className='Modal'
				overlayClassName='Overlay'
			>
				<div className='Modal__body'>
					<h3 className='Modal__title'>{title}</h3>
					<div className='Modal__text'>
						<span>{text}</span>
						<span className='Modal__err'>{textErr}</span>
					</div>
					<Button
						label='Закрыть' 
						className='Modal__btn'
						onClick={onClick}
					/>
				</div>
			</Modal>
    </>
	)
}

ModalWindow.propTypes = {
	title: PropTypes.string,
	text: PropTypes.string,
	textErr: PropTypes.string,
	isOpen: PropTypes.bool.isRequired,
	onRequestClose: PropTypes.func.isRequired,
	onClick: PropTypes.func.isRequired
}

export default ModalWindow;