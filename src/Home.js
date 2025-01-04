import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Card, CardContent, Grid, Box, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { ethers } from "ethers";
import { useWalletState } from "./WalletContext";
import { useNavigate } from 'react-router-dom';
import betContractABI from './bet-abi.json';
import tokenContractABI from './token-abi.json';
import { getBetInfo } from './Graph';
import { useLoading } from './LoadingContext'; // Import the useLoading hook
import { LoadingSpinner } from './LoadingSpinner'; // Import the loading spinner

const betContractAddress = "0x73194Fc3b18521078F3BbA6A605bd5ba64aBbe08";
const tokenContractAddress = "0x6cbc89936b3cb9a67241da63267a2c5454b43fe5";
const betValues = [1, 2, 3, 4, 5];

export function Home() {
    const { isLoading, startLoading, stopLoading } = useLoading();
    const [isConnected, setIsConnected] = useState(false);
    const { betContract, setBetContract, tokenContract, setTokenContract, account, setAccount, roundId, setRoundId } = useWalletState();
    const [betValue, setBetValue] = useState();
    const [betAmount, setBetAmount] = useState(0);
    const [userAllowance, setUserAllowance] = useState(0);
    const [userBalance, setUserBalance] = useState(0);
    const [isApproved, setIsApproved] = useState(false);
    const [canApprove, setCanApprove] = useState(false);
    const [numJoined, setNumJoined] = useState(0);
    const [totalDeposit, setTotalDeposit] = useState(0);
    const [isBetted, setIsBetted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (betContract && tokenContract) {
            setIsConnected(true);
            // get current round id
            startLoading();
            betContract.currentRoundId().then((res) => {
                stopLoading();
                setRoundId(res.toString());
            });
            getBalance();
            getAllowance();
        }
    }, [betContract, tokenContract]);

    useEffect(() => {
        // console.log(userAllowance);
        if (userAllowance && betAmount && betAmount <= parseInt(userAllowance))
            setIsApproved(true);
        else
            setIsApproved(false);
        if (betValue > 0 && betAmount > 0) {
            setCanApprove(true);
        } else {
            setCanApprove(false);
        }
        if (!isBetted && betAmount > userBalance) { setIsApproved(true); setIsBetted(true); } else { setIsBetted(false); }
    }, [betValue, betAmount]);

    const getBalance = () => {
        if (tokenContract) {
            try {
                startLoading();
                tokenContract.balanceOf(account).then((res) => {
                    // console.log("balance", res.toString());
                    stopLoading();
                    setUserBalance(parseInt(res.toString()));
                })
            } catch (error) {
                console.error('error getAllowance', error);
            }
        }
    }

    const getBettingInformation = () => {
        startLoading();
        getBetInfo(roundId).then((res) => {
            // console.log('bet info', res);
            const betArr = res.betPlaceds;
            const userBet = betArr.filter((b) => b._address === account);
            setNumJoined(betArr.length);
            let tBetAmount = 0;
            betArr.map((b) => {
                tBetAmount += parseInt(b._betAmount);
            })

            setTotalDeposit(tBetAmount);
            if (userBet.length) {
                setBetValue(userBet[0]._betValue);
                setBetAmount(userBet[0]._betAmount);
                setIsBetted(true);
                setIsApproved(true);
            }
            stopLoading();
        });
    }

    useEffect(() => {
        // get user bet info
        if (betContract && account) {
            getBettingInformation();
        }
    }, [roundId]);

    const connectWallet = async () => {
        if (!isConnected && window.ethereum) {
            try {
                startLoading();
                const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
                stopLoading();
                setAccount(account[0]);
                const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
                const _signer = ethProvider.getSigner();
                setIsConnected(true);
                connectBetContract(_signer);
                connectTokenContract(_signer);
            } catch (error) {
                // stopLoading();
                console.error(error);
            }
        }
    }

    const disConnectWallet = () => {
        setIsConnected(false);
        setAccount(null);
        setBetContract(null);
        setTokenContract(null);
        setRoundId(null);
        setNumJoined(0);
        setTotalDeposit(0);
        setBetAmount(0);
        setBetValue(0);
        setUserAllowance(0);
        setUserBalance(0);
    };

    const placeBet = async () => {
        if (betContract) {
            try {
                startLoading();
                await betContract.placeBet(betValue, betAmount);
                stopLoading();
                getBettingInformation();
                setIsBetted(true);

            } catch (error) {
                stopLoading();
                console.error(error);
            }
        }
    }

    const handleChangeBetAmount = (e) => {
        // Allow only numbers or empty string
        const newValue = e.target.value;
        if (/^\d*$/.test(newValue)) {
            setBetAmount(newValue);
        }
    }

    const getAllowance = async () => {
        if (tokenContract) {
            try {
                startLoading();
                const res = await tokenContract.allowance(account, betContractAddress);
                stopLoading();
                // console.log("allowance", res.toString());
                setUserAllowance(parseInt(res.toString()));
            } catch (error) {
                console.error('error getAllowance', error);
            }
        }
    }

    const connectBetContract = (signer) => {
        try {
            const contractInstance = new ethers.Contract(
                betContractAddress,
                betContractABI,
                signer
            );
            setBetContract(contractInstance);
            return contractInstance;
        } catch (error) {
            console.log('connectbetcontract', error);
        }
    }

    const connectTokenContract = (signer) => {
        const contractInstance = new ethers.Contract(
            tokenContractAddress,
            tokenContractABI,
            signer
        );
        setTokenContract(contractInstance);
        return contractInstance;
    }

    function handleClick() {
        isConnected ? disConnectWallet() : connectWallet();
    }

    async function handleClickBetApprove() {
        if (isApproved) {
            placeBet();
        } else {
            try {
                startLoading();
                const res = await tokenContract.approve(betContractAddress, betAmount);
                stopLoading();
                setIsApproved(true);
                // console.log(res);
            } catch (error) {
                stopLoading();
                console.log('handleClickBetApprove', error);
            }
        }
    }

    return (
        <div className="">
            {isLoading && <LoadingSpinner />} {/* Show the loading spinner */}
            <Container maxWidth="md" sx={{ paddingTop: 4 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    Round Information
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={12} md={12}>
                        <div style={{ textAlign: "right" }}>
                            {isConnected && (<Button sx={{ mr: 2 }} variant="contained" onClick={() => { navigate('/history') }}>History</Button>)}
                            <Button sx={{ mr: 2 }} variant="contained" onClick={handleClick}>{isConnected ? "Disconnect" : "Connect"}</Button>
                        </div>
                        <Card variant="outlined" sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Current Round: {roundId}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Joined: {numJoined} members
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Total Deposits: {totalDeposit}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    User Balance: {userBalance}
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    User Allowance: {userAllowance}
                                </Typography>
                                <div className='App'>
                                    <Box mt={2} sx={{
                                        maxWidth: '300px', // 50% of the parent element's width
                                        textAlign: 'center',
                                        marginLeft: 'auto',
                                        marginRight: 'auto'
                                    }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="select-label">Select bet value</InputLabel>
                                            <Select
                                                labelId="select-label"
                                                id="select"
                                                value={betValue || ''}
                                                onChange={(e) => { setBetValue(e.target.value) }}
                                                label="Select a number"
                                            >
                                                {/* Options from 1 to 5 */}
                                                {betValues.map((value) => (
                                                    <MenuItem key={value} value={value}>
                                                        {value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <TextField
                                                label=""
                                                type="number"
                                                value={betAmount}
                                                onChange={(e) => { handleChangeBetAmount(e); }}
                                                variant="outlined"
                                                fullWidth
                                                sx={{ marginTop: 1 }}
                                            />
                                            {isApproved && <Button variant="contained" sx={{ marginTop: 1 }} disabled={isBetted ? true : false} onClick={() => { handleClickBetApprove() }}>Bet</Button>}
                                            {!isApproved && <Button variant="contained" sx={{ marginTop: 1 }} disabled={!canApprove || !isConnected ? true : false} onClick={() => { handleClickBetApprove() }}>Approve</Button>}
                                        </FormControl>
                                    </Box>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
