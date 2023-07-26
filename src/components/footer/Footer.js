import React from 'react';
import css from './Footer.module.scss';

function Footer() {
	return (
		<footer className={css.footer}>
			<div className={`wrapper ${css.footer__wrapper}`}>
				<div className={css.footer__copiright}>Velib Location de vélos en libre-service</div>
				<div><a href='mailto:info@veliblocation.fr' target='_blank' rel="noreferrer" className={css.footer__link}>info@velib-location.fr</a></div>	
			</div>
		</footer>
	)
}

export default Footer;