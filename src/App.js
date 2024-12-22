import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { History } from './History';
import { WalletStateProvider } from './WalletContext';

import './App.css';

function App() {
	return (
		<WalletStateProvider>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/history" element={<History />} />
				</Routes>
			</Router>
		</WalletStateProvider>
	);
}

export default App;
