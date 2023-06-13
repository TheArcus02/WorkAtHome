import { Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { OfferCard } from '../components/offer/OfferCard'
import { useInfiniteHits } from 'react-instantsearch-hooks-web'
import { algoliaJobOffer } from '../utils/interfaces'
import { MutableRefObject, useCallback, useRef } from 'react'
import SearchInput from '../components/search/SearchInput'
import RefinementList from '../components/search/RefinamentList'
import RefinementMenu from '../components/search/RefinamentMenu'
import AppliedRefinements from '../components/search/AppliedRefinements'
import { CodeOutlined, TimelineOutlined } from '@mui/icons-material'

export const Offers = () => {
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
        <Container maxWidth="lg" sx={{ my: 5 }}>
            <Paper
                sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
                <SearchInput />
                <Box sx={{ mt: 2, width: '75%' }}>
                    <AppliedRefinements />
                </Box>
            </Paper>
            <Box sx={{ display: 'flex', gap: 5, mt: 5 }}>
                <Paper sx={{ p: 4 }} elevation={0}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <CodeOutlined />
                        <Typography variant="h6">Technologies</Typography>
                    </Box>
                    <RefinementList attribute="technologies" operator="and" limit={5} showMore={true} />
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <TimelineOutlined />
                        <Typography variant="h6">Seniority</Typography>
                    </Box>
                    <RefinementMenu attribute="seniority" />
                </Paper>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        width: '100%',
                    }}
                >
                    {offers.map((offer, index) => (
                        <div
                            ref={offers.length === index + 1 ? lastElementRef : undefined}
                            key={offer.objectID + index}
                        >
                            <OfferCard offer={offer as algoliaJobOffer} elevation={1} maxWidth={'100%'} />
                        </div>
                    ))}
                </Box>
            </Box>
        </Container>
    )
}
