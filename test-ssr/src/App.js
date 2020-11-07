import React, { useState, useEffect } from 'react';
import Home from './Home';
import About from './About';
import styled from 'styled-components';
import Icon from './icon.png';

const Container = styled.div`
	background-color: #aaaaaa;
	border: 1px solid blue;
`;

export default function App(props) {
	const [page, setPage] = useState(props.page);
	useEffect(() => {
		window.onpopstate = (event) => {
			setPage(event.state);
		};
	}, []);
	function onChangePage(e) {
		const newPage = e.target.dataset.page;
		window.history.pushState(newPage, '', `/${newPage}`);
		setPage(newPage);
	}
	const PageComponent = page === 'home' ? Home : About;
	return (
		<Container>
			<button data-page="home" onClick={onChangePage}>
				Home
			</button>
			<button data-page="about" onClick={onChangePage}>
				About
			</button>
			<PageComponent />
			<img src={Icon} />
		</Container>
	);
}
