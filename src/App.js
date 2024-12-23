import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { History } from './History';
import { WalletStateProvider } from './WalletContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import { WagmiConfig } from 'wagmi';
// import { client } from './wagmiClient';
import './App.css';
const queryClient = new QueryClient();

function App() {
	return (
		<WalletStateProvider>
			<QueryClientProvider client={queryClient}>

				{/* <WagmiConfig client={client}> */}
				<Router>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/history" element={<History />} />
					</Routes>
				</Router>
				{/* </WagmiConfig> */}
			</QueryClientProvider>
		</WalletStateProvider>
	);
}

export default App;
