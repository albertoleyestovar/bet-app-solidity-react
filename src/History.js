import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Card, CardContent, Grid, Checkbox, FormControlLabel, FormGroup, Table, TableCell, TableContainer, TableHead, TableRow, Paper, TableBody, CircularProgress } from '@mui/material';
import { useWalletState } from "./WalletContext";
import { getBetHistory, getCurrentRoundId } from './Graph';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useLoading } from './LoadingContext'; // Import the useLoading hook
import { LoadingSpinner } from './LoadingSpinner'; // Import the loading spinner
import './App.css';

const itemsPerPage = 5;
const multi = 1000000;

export function History() {
    const { isLoading, startLoading, stopLoading } = useLoading();
    const [checkedItems, setCheckedItems] = useState({
        notClaimed: false,
        claimed: false,
        joined: false,
    });
    const [roundList, setRoundList] = useState([]);
    const [cRoundId, setCRoundId] = useState();
    const { betContract, account, roundId, setRoundId } = useWalletState();

    const [totalPageCount, setTotalPageCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        // get current round Id
        getCurrentRoundId().then((res) => {
            console.log(res);
            setCRoundId(parseInt(res));
            setTotalPageCount(Math.floor((parseInt(parseInt(res)) + 1) / itemsPerPage));
        })
    }, []);

    const onClaim = async (_roundId) => {
        if (betContract) {
            try {
                // console.log(betContract);

                let newRoundList = roundList.map((f) => {
                    if (f.roundId == _roundId) f.isClaiming = true;
                    else f.isClaiming = false;
                    return f;
                });
                console.log(newRoundList);
                setRoundList(newRoundList);
                const tx = await betContract.onClaim(parseInt(_roundId));
                await tx.wait();
                newRoundList = roundList.map((r) => {
                    if (r.roundId == _roundId) {
                        r.isClaimed = true;
                    }
                    return r;
                });
            } catch (error) {
                console.log(error);
                // console.log(error.message.includes("ACTION_REJECTED"));
            }
        }
    }

    const getHistory = async () => {
        if (!totalPageCount) return;
        startLoading();
        // console.log('account...', account);
        const res = await getBetHistory({
            _address: account,
            pageIndex,
            pageSize: 5,
            isJoined: checkedItems.joined,
            isClaimed: checkedItems.claimed,
            isUnclaimed: checkedItems.notClaimed
        });
        stopLoading();
        console.log(res.userRounds);
        const roundList = res.userRounds;
        let rInfo = {};
        let rList = [];
        const startIndex = (parseInt(cRoundId) + 1) - (pageIndex - 1) * itemsPerPage;
        const endIndex = startIndex - itemsPerPage;
        console.log(cRoundId, startIndex, endIndex);
        for (let i = startIndex; i > endIndex; i--) {
            rInfo.roundId = i;
            rInfo.isCurrentRound = i != cRoundId;
            const betInfo = roundList.filter(r => r._roundId == i)[0] || null;
            if (betInfo) {
                console.log(betInfo._rewardAmount);
                rInfo.betAmount = parseInt(betInfo._betAmount) / multi;
                rInfo.betValue = parseInt(betInfo._betValue) / multi;
                rInfo.isClaimed = betInfo._isClaimed;
                rInfo.rewardAmount = parseInt(betInfo._rewardAmount) / multi;
                rInfo.isLost = betInfo && betInfo._winningValue != betInfo._betValue;
                rInfo.isJoined = betInfo._isJoined;
                rInfo.winningValue = betInfo._winningValue;
                rInfo.totalDeposit = betInfo._totalDeposit;
                rInfo.numJoined = betInfo._numJoined
            } else {
                rInfo = {
                    betAmount: 0,
                    betValue: 0,
                    isClaimed: false,
                    rewardAmount: 0,
                    totalDeposit: 0,
                    isLost: false,
                }
            }
            rList.push(rInfo);
        }
        console.log(rList);
        setRoundList(rList);
    }

    useEffect(() => {
        if (account && totalPageCount) {
            getHistory();
        }
    }, [account, totalPageCount]);

    useEffect(() => {
        getHistory();
    }, [checkedItems]);

    // Handle page change
    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    const handleSubmit = () => {
        alert('Selected options: ' + JSON.stringify(checkedItems));
    };

    const handleChange = (event) => {
        setCheckedItems({
            ...checkedItems,
            [event.target.name]: event.target.checked,
        });
        // console.log(checkedItems);
    };

    return (
        <div className='' style={{ maxWidth: "90%", marginLeft: "auto", marginRight: "auto" }}>
            {/* {isLoading && <LoadingSpinner />} Show the loading spinner */}
            <Container maxWidth="xd" sx={{ paddingTop: 4 }}>
                <Button variant="contained" sx={{ marginTop: 2, marginBottom: 1 }} onClick={() => { navigate('/') }}>Back</Button>
                <Typography variant="h4" gutterBottom>
                    History Page {totalPageCount} {cRoundId}
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={12} md={12}>
                        <Card variant="outlined" sx={{ mt: 2 }}>
                            <CardContent>
                                <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    {1 == 1 && (<><FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checkedItems.notClaimed}
                                                onChange={handleChange}
                                                name="notClaimed"
                                                color="primary"
                                            />
                                        }
                                        label="Not Claimed"
                                    />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checkedItems.claimed}
                                                    onChange={handleChange}
                                                    name="claimed"
                                                    color="primary"
                                                />
                                            }
                                            label="Claimed"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checkedItems.joined}
                                                    onChange={handleChange}
                                                    name="joined"
                                                    color="primary"
                                                />
                                            }
                                            label="Joined"
                                        /></>)}
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>RoundId</TableCell>
                                                    <TableCell align="left">Bet Info</TableCell>
                                                    <TableCell align="left">Rewards</TableCell>
                                                    <TableCell align="left">#</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {isLoading && (
                                                    <TableRow>
                                                        <TableCell colSpan={3} align="center">
                                                            <CircularProgress />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {roundList.slice((pageIndex - 1) * itemsPerPage, pageIndex * itemsPerPage).map((r, index) => {
                                                    // const isClaimed = r.isJoined && r.isClaimed;
                                                    const allowClaim = r.isJoined && !r.isLost && !r.isClaimed && r.roundId != roundId;
                                                    const isCurrentRound = r.roundId == roundId;
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>{r.roundId}</TableCell>
                                                            <TableCell align="left">
                                                                {r.isJoined &&
                                                                    <>Bet Amount: {parseFloat(r.betAmount / multi)}<br />
                                                                        Bet Value: {r.betValue}<br /></>}
                                                                Total Deposits: {r.totalDeposit}<br />
                                                                Joined: {r.numJoined} member(s)
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                Reward Amount: {parseFloat(r.rewardAmount / multi)}<br />
                                                                {r.winningValue && <>Winner Value: {r.winningValue}</>}
                                                            </TableCell>
                                                            <TableCell align="left">{r.isClaming}
                                                                {allowClaim && <Button startIcon={r.isClaiming ? <CircularProgress size={24} color="inherit" /> : null} disabled={r.isClaiming} variant="contained" sx={{ marginTop: 2 }} onClick={() => { onClaim(r.roundId) }}>Claim</Button>}
                                                                {r.isClaimed && <Button variant="contained" disabled={true} sx={{ marginTop: 2 }} onClick={handleSubmit}>Claimed</Button>}
                                                                {!r.isJoined && !isCurrentRound && <Button variant="contained" disabled={true} sx={{ marginTop: 2 }}>Not Joined</Button>}
                                                                {!r.isJoined && isCurrentRound && <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => { navigate('/') }}>Join</Button>}
                                                                {r.isLost && <Button variant="contained" disabled={true} sx={{ marginTop: 2 }}>Lost</Button>}
                                                                {r.currentRound && r.isJoined && <Button variant="contained" disabled={true} sx={{ marginTop: 2 }}>In Progress...</Button>}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <div>
                                        <Stack spacing={2} alignItems="center">
                                            <Pagination
                                                count={totalPageCount}
                                                page={pageIndex}
                                                onChange={handlePageChange}
                                                color="primary"
                                                shape="rounded"
                                                size="large"
                                            />
                                        </Stack>
                                    </div>
                                </FormGroup>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}