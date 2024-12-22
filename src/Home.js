import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Card, CardContent, Grid, Box, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { ethers } from "ethers";
import { useNavigate } from 'react-router-dom';
import betContractABI from './bet-abi.json';
import tokenContractABI from './token-abi.json';

export function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const [betContract, setBetContract] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);
    const [betValue, setBetValue] = useState();
    const [betAmount, setBetAmount] = useState();
    const betContractAddress = "0x73194Fc3b18521078F3BbA6A605bd5ba64aBbe08";
    const tokenContractAddress = "0x6cbc89936b3cb9a67241da63267a2c5454b43fe5";
    const betValues = [1, 2, 3, 4, 5];
    const [roundId, setRoundId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (betContract && tokenContract) {

            // get current round id
            betContract.currentRoundId().then((res) => {
                setRoundId(res.toString());
            });
            // getAllowance();
        }
    }, [betContract, tokenContract]);

    useEffect(() => {
        // get user bet info
        if (betContract && account) {
            betContract.getCurrentBetAmount(account).then((res) => {
                // console.log('user bet amount', res.toString());
            });
        }
    }, [roundId]);

    const connectWallet = async () => {
        if (!isConnected && window.ethereum) {
            try {
                const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(account[0]);
                const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
                const _signer = ethProvider.getSigner();
                setIsConnected(true);
                connectBetContract(_signer);
                connectTokenContract(_signer);
                // await getCurrentRoundId();
                // await getAllowance();
                // await handleTest();
            } catch (error) {
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
    };

    const getAllowance = async () => {
        console.log('aaaaaaaa', tokenContract);
        if (tokenContract) {
            try {
                console.log(account, betContractAddress);
                const allowance = await tokenContract.allowance(account, betContractAddress);
                console.log('allowance', allowance);
            } catch (error) {
                console.error('error11111111111', error);
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

    const handleTest = async () => {
        if (betContract) {
            try {
                // const b = await tokenContract.approve(tokenContractAddress, 100);
                // console.log('approve', b);
                // console.log(betContract);
                console.log(betContract);
                await betContract.placeBet(1, 100);
                // const ddd = await betContract.getCurrentBetAmount(account);
                // const ddd = await betContract.currentRoundId();
                // console.log(ddd);
            } catch (error) {
                console.error(error);
            }
        }
    }
    return (
        <div className="">
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
                                    Joined: XX members
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Total Deposits: XX
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
                                                label="Enter amount"
                                                type="number"
                                                value={betAmount}
                                                onChange={(e) => { setBetAmount(e.target.value) }}
                                                variant="outlined"
                                                fullWidth
                                                sx={{ marginTop: 1 }}
                                            />
                                            <Button variant="contained" sx={{ marginTop: 1 }} onClick={() => { handleTest() }}>Bet</Button>
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
