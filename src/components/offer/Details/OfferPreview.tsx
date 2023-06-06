import {
    EventOutlined,
    ArrowBack,
    BusinessOutlined,
    LocationOnOutlined,
    TimelineOutlined,
    CodeOutlined,
    DescriptionOutlined,
    BorderColorOutlined,
} from '@mui/icons-material'
import { Paper, Box, IconButton, Typography, Divider, Chip, Link as MuiLink, Alert, Button } from '@mui/material'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import { primaryLight } from '../../../utils/colors'
import { firestoreJobOffer } from '../../../utils/interfaces'
import { ApplyForm } from '../ApplyForm'

type OfferPreviewProps = {
    offer: firestoreJobOffer,
    editable: boolean,
    userLogged: boolean,
}

export const OfferPreview: React.FC<OfferPreviewProps> = ({ offer, editable, userLogged }) => {
    const navigate = useNavigate()

    return (
        <>
            <Box>
                <IconButton sx={{ p: 0, mb: 0.7 }} onClick={() => navigate(-1)}>
                    <ArrowBack />
                </IconButton>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: { xs: 'center', md: 'space-between' },
                        mt: 0.5,
                    }}
                >
                    <Typography
                        component='h2'
                        variant='h5'
                        fontWeight='bold'
                        sx={{ textAlign: { xs: 'center', md: 'left' } }}
                    >
                        {offer.title}
                    </Typography>

                    <Typography component='h3' variant='h5' sx={{ textAlign: { xs: 'center', md: 'left' }, my:{xs:1, md:0} }}>
                        {offer.minSalary} - {offer.maxSalary} PLN
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 0.5,
                        alignItems: 'center',
                        justifyContent: { xs: 'center', md: 'left' },
                        mt: 0.5,
                    }}
                >
                    <EventOutlined fontSize='small' />
                    <Typography variant='subtitle2' sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        {moment(offer.createdAt.toDate()).calendar()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', md: 'nowrap' } }} my={2}>
                    <Paper
                        sx={{
                            p: 1.5,
                            width: { xs: '100%', md: 'initial' },
                            display: { xs: 'flex', md: 'inherit' },
                            justifyContent: 'center',
                        }}
                        elevation={0}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BusinessOutlined sx={{ color: primaryLight }} />
                            <MuiLink
                                component={Link}
                                to={`/company/${offer.companyUid}`}
                                underline='none'
                                color='secondary'
                            >
                                <Typography ml={1}>{offer.companyName}</Typography>
                            </MuiLink>
                        </Box>
                    </Paper>

                    <Paper
                        sx={{
                            p: 1.5,
                            width: { xs: '100%', md: 'initial' },
                            display: { xs: 'flex', md: 'inherit' },
                            justifyContent: 'center',
                        }}
                        elevation={0}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnOutlined sx={{ color: primaryLight }} />
                            <Typography ml={1}>{offer.location}</Typography>
                        </Box>
                    </Paper>

                    <Paper
                        sx={{
                            p: 1.5,
                            width: { xs: '100%', md: 'initial' },
                            display: { xs: 'flex', md: 'inherit' },
                            justifyContent: 'center',
                        }}
                        elevation={0}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimelineOutlined sx={{ color: primaryLight }} />
                            <Typography ml={1}>{offer.seniority}</Typography>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {offer.technologies.length > 0 && (
                    <Paper elevation={0} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <CodeOutlined />
                            <Typography variant='h5' ml={1}>
                                Tech stack
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {offer.technologies.map((tech) => (
                                <Chip label={tech} key={tech} />
                            ))}
                        </Box>
                    </Paper>
                )}

                <Paper elevation={0} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <DescriptionOutlined />
                        <Typography variant='h5' ml={1}>
                            Description
                        </Typography>
                    </Box>
                    <Divider />
                    <Typography variant='body1' mt={1.5} sx={{ textAlign: { xs: 'left', md: 'justify' } }}>
                        {offer.description}
                    </Typography>
                </Paper>

                {!editable && (
                    <Paper elevation={0} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <BorderColorOutlined />
                            <Typography variant='h5' ml={1}>
                                Apply for this job
                            </Typography>
                        </Box>
                        <Divider />
                        <Box mt={2}>
                            {userLogged ? (
                                <ApplyForm offerUid={offer.uid} />
                            ) : (
                                <Alert
                                    severity='info'
                                    variant='outlined'
                                    action={
                                        <Button color='inherit' size='small' onClick={() => navigate('/login')}>
                                            Login
                                        </Button>
                                    }
                                >
                                    You need to be logged in to apply for this job.
                                </Alert>
                            )}
                        </Box>
                    </Paper>
                )}
            </Box>
        </>
    )
}
