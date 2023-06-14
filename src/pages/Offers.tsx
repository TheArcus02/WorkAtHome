import { Paper, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import { OfferCard } from '../components/offer/OfferCard'
import { useInfiniteHits } from 'react-instantsearch-hooks-web'
import { algoliaJobOffer } from '../utils/interfaces'
import { MutableRefObject, useCallback, useRef } from 'react'
import { CodeOutlined, TimelineOutlined } from '@mui/icons-material'
import SearchInput from '../components/search/SearchInput'
import RefinementList from '../components/search/RefinamentList'
import RefinementMenu from '../components/search/RefinamentMenu'
import AppliedRefinements from '../components/search/AppliedRefinements'
import Sorting from '../components/search/Sorting'

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
        [isLastPage, showMore]
    )

    return (
        <Container maxWidth="xl" sx={{ my: 5 }}>
            <Paper
                sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                // elevation={2}
            >
                <Typography variant="h4" component="h2" mb={2}>
                    Search over 10k job offers from the entire world.
                </Typography>
                <SearchInput />
            </Paper>
            <Box sx={{ display: 'flex', gap: 3, mt: 5 }}>
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <TimelineOutlined />
                        <Typography variant="h6">Seniority</Typography>
                    </Box>
                    <RefinementMenu attribute="seniority" />
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 3, gap: 1 }}>
                        <CodeOutlined />
                        <Typography variant="h6">Technologies</Typography>
                    </Box>
                    <RefinementList attribute="technologies" operator="and" limit={5} showMore={true} />
                </Paper>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%',
                    }}
                >
                    <Paper sx={{ display: 'flex', p: 2 }}>
                        <AppliedRefinements />

                        <Box sx={{ marginLeft: 'auto' }}>
                            <Sorting
                                items={[
                                    { label: 'Featured', value: 'Offers' },
                                    { label: 'Salary (asc)', value: 'Offers_minSalary_asc' },
                                    { label: 'Salary (desc)', value: 'Offers_maxSalary_desc' },
                                ]}
                            />
                        </Box>
                    </Paper>
                    {offers.map((offer, index) => (
                        <div
                            ref={offers.length === index + 1 ? lastElementRef : undefined}
                            key={offer.objectID + index}
                        >
                            <OfferCard offer={offer as algoliaJobOffer} elevation={0} maxWidth={'100%'} />
                        </div>
                    ))}
                </Box>
            </Box>
        </Container>
    )
}
