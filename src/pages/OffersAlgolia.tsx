import { Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { OfferCard } from '../components/offer/OfferCard'
import { useInfiniteHits } from 'react-instantsearch-hooks-web'
import { algoliaJobOffer } from '../utils/interfaces'
import { MutableRefObject, useCallback, useRef } from 'react'
import SearchInput from '../components/SearchInput'

export const OffersAlgolia = () => {
    const { hits: offers, isLastPage, showMore } = useInfiniteHits<algoliaJobOffer>()

    const observer: MutableRefObject<IntersectionObserver> | MutableRefObject<undefined> = useRef()

    const lastElementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !isLastPage) {
                    showMore()
                }
            })
            if (node) observer.current.observe(node)
        },
        [isLastPage]
    )

    return (
        <Container maxWidth="md" sx={{ my: 5 }}>
            <Paper
                sx={{ p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
                <SearchInput />
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
                    console.log(offer)
                    return (
                        <div
                            ref={offers.length === index + 1 ? lastElementRef : undefined}
                            key={offer.objectID + index}
                        >
                            <OfferCard offer={offer as algoliaJobOffer} elevation={1} maxWidth={'100%'} />
                        </div>
                    )
                })}
            </Box>
        </Container>
    )
}
