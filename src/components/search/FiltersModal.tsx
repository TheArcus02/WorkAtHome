import { TimelineOutlined, CodeOutlined } from '@mui/icons-material'
import { Box, Divider, Fade, Modal, Typography } from '@mui/material'
import RefinementMenu from './RefinamentMenu'
import RefinementList from './RefinamentList'

interface FiltersModalProps {
    open: boolean
    handleClose: () => void
}

const FiltersModal: React.FC<FiltersModalProps> = ({ open, handleClose }) => {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            disablePortal={true}
            sx={{
                overflow: 'scroll',
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 5,
                    }}
                >
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                        Filters
                    </Typography>
                    <Box sx={{ display: { sm: 'flex', xs: 'block' }, justifyContent: 'center', gap: 3 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', my: 1, gap: 1 }}>
                                <TimelineOutlined />
                                <Typography variant="h6">Seniority</Typography>
                            </Box>
                            <RefinementMenu attribute="seniority" />
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', my: 1, gap: 1 }}>
                                <CodeOutlined />
                                <Typography variant="h6">Technologies</Typography>
                            </Box>
                            <RefinementList attribute="technologies" operator="and" limit={5} showMore={true} />
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default FiltersModal
