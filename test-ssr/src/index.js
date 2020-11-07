import React from 'react';
import ReactDom from 'react-dom';
import App from './App';

const initialData = window.__INITIAL__DATA;
ReactDom.render(
	<App page={initialData.page} />,
	document.getElementById('root')
);
ReactDom.hydrate(
	<App page={initialData.page} />,
	document.getElementById('root')
);
