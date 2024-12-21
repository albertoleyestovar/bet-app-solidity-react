import React, { useState } from 'react';
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
    const betContractAddress = "0xfe6e0b56333615c594576b2d90b0adfb09c538b9";
    const tokenContractAddress = "0x6cbc89936b3cb9a67241da63267a2c5454b43fe5";
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(account);
                const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
                const _signer = ethProvider.getSigner();
                setIsConnected(true);
                await connectBetContract(_signer);
                await connectTokenContract(_signer);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const connectBetContract = async (signer) => {
        const contractInstance = new ethers.Contract(
            betContractAddress,
            betContractABI,
            signer
        );
        setBetContract(contractInstance);
    }

    const connectTokenContract = async (signer) => {
        const contractInstance = new ethers.Contract(
            tokenContractAddress,
            tokenContractABI,
            signer
        );
        console.log('aaa', contractInstance);
        setTokenContract(contractInstance);
    }

    function handleClick() {
        connectWallet();
    }

    const handleTest = async () => {
        if (betContract) {
            try {
                const b = await tokenContract.approve(tokenContractAddress, 100);
                console.log('approve', b);
                await betContract.placeBet(1, 100);
                console.log('111');
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
                            <Button sx={{ mr: 2 }} variant="contained" onClick={handleClick}>Connect</Button>
                            {/* <Button sx={{ mr: 2 }} style={{ float: "right" }} variant="contained" onClick={handleTest}>Test Bet</Button> */}
                        </div>
                        <Card variant="outlined" sx={{ mt: 2 }} style={{ textAlign: "center" }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Current Round: 1
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Joined: XX members
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Total Deposits: XX
                                </Typography>
                                <div className='App' style={{ 'paddingLeft': 'calc(50% - 150px)' }}>
                                    <Box mt={2} sx={{
                                        width: '50%', // 50% of the parent element's width
                                        textAlign: 'center',
                                    }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="select-label">Select bet value</InputLabel>
                                            <Select
                                                labelId="select-label"
                                                id="select"
                                                value={betValue}
                                                onChange={(e) => { setBetValue(e.target.value) }}
                                                label="Select a number"
                                            >
                                                {/* Options from 1 to 5 */}
                                                {[1, 2, 3, 4, 5].map((value) => (
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
                                            <Button variant="contained" sx={{ marginTop: 1 }}>Bet</Button>
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
