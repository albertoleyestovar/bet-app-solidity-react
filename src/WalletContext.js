// Create a context
import React, { createContext, useState, useContext } from 'react';

const WalletStateContext = createContext();

export const useWalletState = () => {
    return useContext(WalletStateContext);
};

export const WalletStateProvider = ({ children }) => {
    const [betContract, setBetContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [roundId, setRoundId] = useState(null);

    return (
        <WalletStateContext.Provider value={{ betContract, setBetContract, account, setAccount, roundId, setRoundId }}>
            {children}
        </WalletStateContext.Provider>
    );
};
