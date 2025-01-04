import React, { useState, useEffect } from 'react';
import { Container, Button, Typography, Card, CardContent, Grid, Checkbox, FormControlLabel, FormGroup, Table, TableCell, TableContainer, TableHead, TableRow, Paper, TableBody } from '@mui/material';
import { useWalletState } from "./WalletContext";
import { getBetHistory } from './Graph';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useLoading } from './LoadingContext'; // Import the useLoading hook
import { LoadingSpinner } from './LoadingSpinner'; // Import the loading spinner
import './App.css';

const itemsPerPage = 5;
export function History() {
    const { isLoading, startLoading, stopLoading } = useLoading();
    const [checkedItems, setCheckedItems] = useState({
        notClaimed: false,
        claimed: false,
        joined: false,
    });
    const [roundList, setRoundList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const { betContract, account, roundId } = useWalletState();

    const [totalPageCount, setTotalPageCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const navigate = useNavigate();

    const calcRewardAmount = (betPlaceds, betAmount, winValue) => {
        const totalBetAmount = betPlaceds.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue._betAmount), 0);
        const totalWinAmount = betPlaceds.filter((b) => b._betValue == winValue).reduce((accumulator, currentValue) => accumulator + parseInt(currentValue._betAmount), 0);
        const rewardAmount = totalWinAmount == 0 ? 0 : parseInt(parseInt(betAmount) * totalBetAmount * 0.95 / totalWinAmount);
        return rewardAmount;

    }

    const onClaim = async (_roundId) => {
        if (betContract) {
            try {
                // console.log(betContract);
                startLoading();
                await betContract.onClaim(parseInt(_roundId));
                await getHistory();
            } catch (error) {
                stopLoading();
                console.log(error);
                // console.log(error.message.includes("ACTION_REJECTED"));
            }
        }
    }

    const getHistory = async () => {
        startLoading();
        const res = await getBetHistory(account);
        stopLoading();
        const betPlaceds = res.betPlaceds;
        const claimedRewards = res.claimedRewards;
        const betRoundFinisheds = res.betRoundFinisheds;
        const list = [];
        for (let i = 1; i <= roundId; i++) {
            const roundBettingInfo = betPlaceds.filter((b) => b._roundId == i && b._address == account)[0] || null;
            const claimInfo = claimedRewards.filter((c) => c._roundId == i)[0] || null;
            const betFinishInfo = betRoundFinisheds.filter((c) => c._roundId == i)[0] || null;

            // calc rewardAmount
            let rewardAmount = "XXX";
            if (!roundBettingInfo) rewardAmount = "XXX";
            if (claimInfo) rewardAmount = claimInfo._rewardAmount;
            if (roundBettingInfo && !claimInfo && betFinishInfo) {
                if (betFinishInfo._winningValue != roundBettingInfo._betValue) rewardAmount = 0;
                else {
                    rewardAmount = calcRewardAmount(betPlaceds.filter((b) => b._roundId == i), roundBettingInfo._betAmount, betFinishInfo._winningValue);
                }
            }
            list.push({
                roundId: i,
                betAmount: roundBettingInfo ? roundBettingInfo._betAmount : "XXX",
                betValue: roundBettingInfo ? roundBettingInfo._betValue : "XX",
                isClaimed: claimInfo ? true : false,
                rewardAmount,
                isLost: roundBettingInfo && betFinishInfo && (roundBettingInfo._betValue != betFinishInfo._winningValue),
                isJoined: roundBettingInfo !== null
            });
            setRoundList(list);
            setTotalPageCount(Math.ceil(roundId / itemsPerPage));
        }
    }
    useEffect(() => {
        if (betContract) {
            getHistory();
        }
    }, []);

    useEffect(() => {

    }, [checkedItems]);

    useEffect(() => {
        setFilterList(roundList);
    }, [roundList]);
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
    };

    return (
        <div className='' style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
            {isLoading && <LoadingSpinner />} {/* Show the loading spinner */}
            <Container maxWidth="xd" sx={{ paddingTop: 4 }}>
                <Button variant="contained" sx={{ marginTop: 2, marginBottom: 1 }} onClick={() => { navigate('/') }}>Back</Button>
                <Typography variant="h4" gutterBottom>
                    History Page
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={12} md={12}>
                        <Card variant="outlined" sx={{ mt: 2 }}>
                            <CardContent>
                                <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    {1 == 5 && (<><FormControlLabel
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
                                                {filterList.slice((pageIndex - 1) * itemsPerPage, pageIndex * itemsPerPage).map((r, index) => {
                                                    // const isClaimed = r.isJoined && r.isClaimed;
                                                    const allowClaim = r.isJoined && !r.isLost && !r.isClaimed && r.roundId != roundId;
                                                    const isCurrentRound = r.roundId == roundId;
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>{r.roundId}</TableCell>
                                                            <TableCell align="left">
                                                                Bet Amount: {r.betAmount}<br />
                                                                Bet Value: {r.betValue}</TableCell>
                                                            <TableCell align="left">Reward Amount: {r.rewardAmount}</TableCell>
                                                            <TableCell align="left">
                                                                {allowClaim && <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => { onClaim(r.roundId) }}>Claim</Button>}
                                                                {r.isClaimed && <Button variant="contained" disabled={true} sx={{ marginTop: 2 }} onClick={handleSubmit}>Claimed</Button>}
                                                                {!r.isJoined && !isCurrentRound && <Button variant="contained" disabled={true} sx={{ marginTop: 2 }}>Not Joined</Button>}
                                                                {!r.isJoined && isCurrentRound && <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => { navigate('/') }}>Join</Button>}
                                                                {r.isLost && <Button variant="contained" disabled={true} sx={{ marginTop: 2 }}>Lost</Button>}
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