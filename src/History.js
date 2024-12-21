import React, { useState } from 'react';
import { Container, Button, Typography, Card, CardContent, Grid, Box, Checkbox, FormControlLabel, FormGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './App.css';

export function History() {
    const [checkedItems, setCheckedItems] = useState({
        notClaimed: false,
        claimed: false,
        joined: false,
    });

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
        <>
            <Container maxWidth="xd" sx={{ paddingTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    History Page
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={12} md={12}>
                        <Card variant="outlined" sx={{ mt: 2 }}>
                            <CardContent>
                                <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <FormControlLabel
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
                                    />
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
                                            
                                        </Table>
                                    </TableContainer>
                                </FormGroup>
                                <Button variant="contained" sx={{ marginTop: 2 }} onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}