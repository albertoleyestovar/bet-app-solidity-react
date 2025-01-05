// Create a context
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletStateContext = createContext();

export const useWalletState = () => {
    return useContext(WalletStateContext);
};

export const WalletStateProvider = ({ children }) => {
    const [tokenContract, setTokenContract] = useState(null);
    const [betContract, setBetContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [roundId, setRoundId] = useState(null);

    const checkConnection = async () => {
        if (window.ethereum) {
            try {
                // Create an ethers provider instance
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                // Get the current account
                const accounts = await provider.listAccounts();

                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    // setIsConnected(true);

                    // Store the account and chainId in localStorage
                    // localStorage.setItem("account", accounts[0]);
                    // localStorage.setItem("chainId", currentChainId.chainId.toString());
                }
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
                // setIsConnected(false);
            }
        }
    }
    useEffect(() => {
        checkConnection();
    }, []);

    return (
        <WalletStateContext.Provider value={{ betContract, setBetContract, tokenContract, setTokenContract, account, setAccount, roundId, setRoundId }}>
            {children}
        </WalletStateContext.Provider>
    );
};
