import { SearchOutlined } from '@mui/icons-material'
import { IconButton, InputAdornment, OutlinedInput, Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { DocumentData, limit, orderBy, QueryDocumentSnapshot, startAfter, where } from 'firebase/firestore'
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { OfferCard } from '../components/offer/OfferCard'
import { useQuery } from '../hooks/useQuery'
import { algoliaJobOffer, firestoreJobOffer, Order } from '../utils/interfaces'

export const Offers = () => {
    const [offers, setOffers] = useState<firestoreJobOffer[]>([])
    const [sortField, setSortField] = useState('createdAt')
    const [order, setOrder] = useState<Order>('desc')
    const [pageSize, setPageSize] = useState(2)
    const [last, setLast] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)

    const { getQuery, queryResult, unsubscribe } = useQuery()

    const observer: MutableRefObject<IntersectionObserver> | MutableRefObject<undefined> = useRef()

    const lastElementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && last) {
                    nextPage()
                }
            })
            if (node) observer.current.observe(node)
        },
        [last]
    )

    useEffect(() => {
        getQuery('', 'Offers', where('active', '==', true), orderBy(sortField, order), limit(pageSize))
    }, [pageSize, sortField])

    useEffect(() => {
        if (queryResult && !last) {
            if (!queryResult.empty) {
                queryResult.forEach((res) => setOffers((prev) => [...prev, res.data() as firestoreJobOffer]))
                setLast(queryResult.docs[queryResult.docs.length - 1])
            }
        }

        return () => {
            if (offers.length !== 0 && last) {
                setLast(null)
            }
        }
    }, [queryResult, offers, last])

    useEffect(() => {
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [unsubscribe])

    const nextPage = () => {
        getQuery(
            '',
            'Offers',
            where('active', '==', true),
            orderBy(sortField, order),
            startAfter(last),
            limit(pageSize)
        )
    }

    return (
        <Container maxWidth="md" sx={{ my: 5 }}>
            <Paper
                sx={{ p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
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
                    placeholder="Look for remote job (dosen't work, firestore free version dosen't support search)"
                    sx={{
                        width: '75%',
                    }}
                />
            </Paper>
            <Typography variant="h4" my={3}>
                Recent job offers
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                {offers.map((offer, index) => {
                    const algoliaOffer: algoliaJobOffer = {
                        ...offer,
                        objectID: offer.uid,
                        path: `/offer/${offer.uid}`,
                        __position: index,
                    }
                    return (
                        <div ref={offers.length === index + 1 ? lastElementRef : undefined} key={offer.uid + index}>
                            <OfferCard offer={algoliaOffer} elevation={1} maxWidth={'100%'} />
                        </div>
                    )
                })}
            </Box>
        </Container>
    )
}
