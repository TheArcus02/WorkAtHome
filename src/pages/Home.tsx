import { Box, Button, Container, IconButton, InputAdornment, OutlinedInput, Paper, Typography } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { useState } from 'react'
import { algoliaJobOffer } from '../utils/interfaces'
import { OfferSkeleton } from '../components/offer/OfferSkeleton'
import { OfferCard } from '../components/offer/OfferCard'
import { ArrowForward } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useHits } from 'react-instantsearch-hooks-web'
export const Home: React.FC = () => {
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const navigate = useNavigate()
    const { hits: offers } = useHits<algoliaJobOffer>()

    const handleSearch = () => {
        navigate(`offers`, { state: { query } })
    }

    return (
        <>
            <Container sx={{ my: 5 }} maxWidth="lg">
                <Paper
                    sx={{
                        p: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
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
                        placeholder="Look for remote job"
                        sx={{
                            width: '75%',
                        }}
                        onChange={(event) => setQuery(event.currentTarget.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={(event) => {
                            if (isFocused && event.key === 'Enter') {
                                event.preventDefault()
                                handleSearch()
                            }
                        }}
                    />
                </Paper>
            </Container>
            <Paper elevation={1} sx={{ py: 5 }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" textAlign="center" sx={{ pb: 5 }}>
                        Recent Job Offers
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                            px: { xs: 2, md: 0 },
                        }}
                    >
                        {offers.length > 0
                            ? offers.map((offer, index) => (
                                  <OfferCard offer={offer} elevation={0} key={offer.uid + index} />
                              ))
                            : [...Array(6)].map((_, index) => <OfferSkeleton elevation={0} key={index} />)}
                        {}
                    </Box>
                    <Box mt={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" endIcon={<ArrowForward />} onClick={() => navigate('offers')}>
                            Show more
                        </Button>
                    </Box>
                </Container>
            </Paper>
        </>
    )
}
