import React from 'react';
import { Link } from 'react-router-dom';

import css from './NotFoundPage.module.scss';

function NotFoundPage() {
	return (
		<article className={css.notfoundpage}>
			<h1 className={css.notfoundpage__title}>Erreur 404</h1>
			<p className={css.notfoundpage__title}>La page n'existe pas</p>
			<p className={css.notfoundpage__title}>Aller à <Link to='/' className={css.notfoundpage__btn}>page d'accueil</Link></p>
		</article>
	);
}

export default NotFoundPage;