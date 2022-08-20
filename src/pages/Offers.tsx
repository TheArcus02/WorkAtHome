import { SearchOutlined } from "@mui/icons-material"
import { Button, IconButton, InputAdornment, OutlinedInput, Paper, Typography } from "@mui/material"
import { Box, Container } from "@mui/system"
import { DocumentData, limit, orderBy, QueryDocumentSnapshot, startAfter, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { OfferCard } from "../components/offer/OfferCard"
import { useQuery } from "../hooks/useQuery"
import { firestoreJobOffer, Order } from "../utils/interfaces"

export const Offers = () => {

    const [offers, setOffers] = useState<firestoreJobOffer[]>([])
    const [sortField, setSortField] = useState("createdAt")
    const [order, setOrder] = useState<Order>("desc")
    const [pageSize, setPageSize] = useState(1)
    const [last, setLast] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)

    const { getQuery, queryRef, queryResult, unsubscribe } = useQuery()

    useEffect(() => {
        getQuery("",
            "Offers",
            where('active', "==", true),
            orderBy(sortField, order),
            limit(pageSize),
        )
    }, [pageSize, sortField])

    useEffect(() => {
        if (queryResult && !last) {
            if (!queryResult.empty) {
                queryResult.forEach((res) => (
                    setOffers((prev) => [...prev, res.data() as firestoreJobOffer])
                ))
                setLast(queryResult.docs[queryResult.docs.length - 1])
            }
        }

        if (offers.length !== 0)
            return () => {
                setLast(null)
            }
    }, [queryResult, offers])

    useEffect(() => {
        if (offers.length !== 0)
            console.log({ offers, last })
    }, [offers])


    const nextPage = () => {
        getQuery("",
            "Offers",
            where('active', "==", true),
            orderBy(sortField, order),
            startAfter(last),
            limit(pageSize)
        )
    }
    // TODO implement search params
    return (
        <Container maxWidth="lg" sx={{ my: 5 }}>
            <Paper sx={{ p: 6, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
                <OutlinedInput
                    id="job-search"
                    type="text"
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton edge="end">
                                <SearchOutlined color="primary" />
                            </IconButton>
                        </InputAdornment>
                    }
                    fullWidth
                    placeholder="Look for remote job"
                    sx={{
                        width: '75%'
                    }}
                />
            </Paper>
            <Box sx={{display:'flex', mt: 3, gap:3 }}>
                {/* // TODO add maxHeight refering to max content implement sort form */}
                <Paper sx={{width:300}}>
                </Paper>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
                    {/* put search param if exists here ⬇ */}
                    {/* <Typography variant="h4">React Job Offers</Typography> */}
                    {offers.map((offer, index) => (
                        <OfferCard
                            offer={offer}
                            elevation={1}
                            maxWidth={'100%'}
                            key={offer.uid + index}
                        />
                    ))}
                </Box>
            </Box>
            <Button disabled={!last} onClick={() => nextPage()}>
                nextPage
            </Button>
        </Container>
    )
}
