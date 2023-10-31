import { TimelineOutlined, CodeOutlined } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material'
import RefinementMenu from './RefinamentMenu'
import RefinementList from './RefinamentList'

interface FiltersDialogProps {
    open: boolean
    handleClose: () => void
}

const FiltersDialog: React.FC<FiltersDialogProps> = ({ open, handleClose }) => {
    return (
        <Dialog open={open} onClose={handleClose} disablePortal>
            <DialogTitle>Filters</DialogTitle>
            <DialogContent>
                <Box sx={{ display: { xs: 'block', sm: 'flex' }, gap: 2 }}>
                    <Box sx={{ mb: { xs: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <TimelineOutlined />
                            <Typography variant="h6">Seniority</Typography>
                        </Box>
                        <RefinementMenu attribute="seniority" />
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <CodeOutlined />
                            <Typography variant="h6">Technologies</Typography>
                        </Box>
                        <RefinementList attribute="technologies" operator="and" limit={5} showMore={true} />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="secondary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FiltersDialog
