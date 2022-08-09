import { Box, Dialog, DialogTitle } from "@mui/material"
import { firestoreEntry } from "../../utils/interfaces";
import { ApplyEditForm } from "./ApplyEditForm";

type ApplyEditDialogProps = {
    open: boolean;
    handleClose: () => void;
    entry: firestoreEntry;
    offerUid: string;
}

export const ApplyEditDialog: React.FC<ApplyEditDialogProps> = ({ open, handleClose, entry, offerUid }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Job Apply</DialogTitle>
            <Box sx={{px: 4, pb: 4}}>
                <ApplyEditForm entry={entry} offerUid={offerUid} />
            </Box>
        </Dialog>
    )
}
