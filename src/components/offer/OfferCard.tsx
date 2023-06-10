import { BusinessOutlined, LocationOnOutlined } from '@mui/icons-material'
import { Card, CardActionArea, CardContent, Chip, Paper, Typography, Box, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { primaryLight } from '../../utils/colors'
import { algoliaJobOffer } from '../../utils/interfaces'
import { Highlight, Snippet } from 'react-instantsearch-hooks-web'

type offerCardProps = {
    offer: algoliaJobOffer
    elevation: number
    maxWidth?: number | string
}

export const OfferCard: React.FC<offerCardProps> = ({ offer, elevation, maxWidth }) => {
    const navigate = useNavigate()

    return (
        <Card sx={!maxWidth ? { maxWidth: 385 } : { maxWidth: maxWidth }} elevation={elevation}>
            <CardActionArea onClick={() => navigate(`/offer/${offer.objectID}`)}>
                <CardContent>
                    <Typography variant="h5" mb={0.5}>
                        <Highlight attribute="title" hit={offer} />
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: primaryLight }} mb={1}>
                        {offer.minSalary} - {offer.maxSalary} PLN
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, my: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                            <BusinessOutlined color="inherit" />
                            <Typography ml={1} color="inherit">
                                {offer.companyName}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                            <LocationOnOutlined color="inherit" />
                            <Typography ml={1} color="inherit">
                                {offer.location.split(',')[0]}
                            </Typography>
                        </Box>
                    </Box>
                    <Divider />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={offer.technologies.length > 0 ? { my: 1 } : { mt: 1 }}
                    >
                        <Snippet attribute="description" hit={offer} />
                    </Typography>

                    {offer.technologies.length > 0 && (
                        <>
                            <Divider />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                {offer.technologies.map((tech) => (
                                    <Chip label={tech} key={tech} color="secondary" variant="outlined" />
                                ))}
                            </Box>
                        </>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
