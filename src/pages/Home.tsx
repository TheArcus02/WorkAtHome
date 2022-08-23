import { Box, Button, Container, IconButton, InputAdornment, OutlinedInput, Paper, Typography } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useEffect, useState } from "react";
import { firestoreJobOffer } from "../utils/interfaces";
import { useQuery } from "../hooks/useQuery";
import { limit, orderBy, where } from "firebase/firestore";
import { OfferSkeleton } from "../components/offer/OfferSkeleton";
import { OfferCard } from "../components/offer/OfferCard";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {

    const [recentOffers, setRecentOffers] = useState<firestoreJobOffer[]>([])

    const { getQuery, queryResult, queryRef, unsubscribe } = useQuery()
    const navigate = useNavigate()

    useEffect(() => {
        if (recentOffers.length === 0) {
            getQuery('', "Offers", where("active", "==", true), orderBy("createdAt", "desc"), limit(6))
        }
    }, [recentOffers])

    useEffect(() => {
        if (queryResult && recentOffers.length === 0) {
            queryResult.forEach((doc: any) => {
                setRecentOffers((prev) => (
                    [...prev, doc.data()]
                ))
            })
        }
    }, [queryResult, queryRef, recentOffers])

    useEffect(() => {
        if (unsubscribe)
            return () => {
                unsubscribe()
            }
    }, [unsubscribe])


    return (
        <>
            <Container sx={{ my: 5 }} maxWidth="lg">
                <Paper sx={{ p: 6, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
                    <Typography variant="h4" component="h2" gutterBottom>
                        Search over 10k job offers from the entire world.
                    </Typography>
                    <OutlinedInput
                        id="job-search"
                        type="text"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton edge="end">
                                    <SearchOutlinedIcon color="primary" />
                                </IconButton>
                            </InputAdornment>
                        }
                        fullWidth
                        placeholder="Look for remote job (dosen't work, firestore free version dosen't suppor search)"
                        sx={{
                            width: '75%'
                        }}
                    />
                </Paper>
            </Container>
            <Paper elevation={1} sx={{py: 5}}>
                <Container maxWidth="xl">
                    <Typography variant="h4" textAlign="center" sx={{ pb: 5 }}>Recent Job Offers</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', px: { xs: 2, md: 0 } }}>
                        {recentOffers.length > 0 ? (
                            recentOffers.map((offer, index) => (
                                <OfferCard offer={offer} elevation={0} key={offer.uid + index} />
                            ))
                        ) : ([...Array(6)].map((_, index) => (
                            <OfferSkeleton elevation={0} key={index} />
                        )))}
                        { }
                    </Box>
                    <Box mt={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('offers')}
                        >
                            Show more
                        </Button>
                    </Box>
                </Container>
            </Paper>

        </>
    )
}