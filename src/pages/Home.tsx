import { Box, Button, Container,IconButton, InputAdornment, OutlinedInput, Paper, Typography } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useEffect, useState } from "react";
import { firestoreJobOffer } from "../utils/interfaces";
import { useQuery } from "../hooks/useQuery";
import { limit, orderBy } from "firebase/firestore";
import { OfferSkeleton } from "../components/offer/OfferSkeleton";
import { OfferCard } from "../components/offer/OfferCard";
import { ArrowForward } from "@mui/icons-material";

export const Home:React.FC = () => {
    
    const [recentOffers, setRecentOffers] = useState<firestoreJobOffer[]>([])
    
    const { getQuery, queryResult, queryRef } = useQuery()

    useEffect(() => {
        if(recentOffers.length === 0){
            getQuery('recent', "Offers", orderBy("createdAt", "desc"), limit(1))
        }
    }, [recentOffers])
    
    useEffect(() => {
        if(queryResult && queryRef){
            queryResult.forEach((doc: any) => {
                switch(queryRef){
                    case 'recent': setRecentOffers((prev) => (
                        [...prev, doc.data()]
                    ))
                    default: return
                }
            })
        }
    }, [queryResult, queryRef])

    return(
        <>
            <Container sx={{my:5}} maxWidth="lg">
                <Paper sx={{p:6, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}} >
                    <Typography variant="h4" component="h2" gutterBottom>
                        Search over 10k job offers from the entire world.
                    </Typography>
                    <OutlinedInput 
                        id="job-search"
                        type="text"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton edge="end">
                                    <SearchOutlinedIcon color="primary"/>
                                </IconButton>
                            </InputAdornment>
                        }
                        fullWidth
                        placeholder="Look for remote job"
                        sx={{
                            width:'75%'
                        }}
                    />
                </Paper>
            </Container>
            
            <Container maxWidth="xl">

            {recentOffers.length > 0 ? (
                <Paper elevation={1}>
                    <Typography variant="h4" textAlign="center" sx={{py:5}}>Recent Job Offers</Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center', gap:2, flexWrap:'wrap', px:{xs:2, md:0}}}>
                        {recentOffers.map((offer, index) => (
                            <OfferCard offer={offer} elevation={0} maxWidth={385} key={offer.uid + index} />
                        ))}
                    </Box>
                    <Box mt={2} sx={{display: 'flex', justifyContent:'center'}}>
                        <Button variant="contained" endIcon={<ArrowForward />}>Show more</Button>
                        {/* // TODO add navigate to offersSection when ready */}
                    </Box>
                </Paper>
            ) : <OfferSkeleton />}

            </Container>
        </>
    )
}