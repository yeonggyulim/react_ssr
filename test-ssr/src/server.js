import express from 'express';
import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import React from 'react';
import App from './App';
import * as url from 'url';

const app = express();
const html = fs.readFileSync(
	path.resolve(__dirname, '../dist/index.html'),
	'utf8'
);
app.use('/dist', express.static('dist'));
app.get('/favicon/ico', (req, res) => res.sendStatus(204));
app.get('*', (req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const page = parsedUrl.pathname ? parsedUrl.pathname.substr(1) : 'home';

	const renderString = renderToString(<App page="home" />);
	const initialData = { page };
	const result = html
		.replace('<div id="root"></div>', `<div id="root">${renderString}</div>`)
		.replace('__DATA_FROM_SERVER__', JSON.stringify(initialData));
	res.send(result);
});
app.listen(3000);
