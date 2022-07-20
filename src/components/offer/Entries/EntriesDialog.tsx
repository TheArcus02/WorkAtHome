import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { secondaryLight } from "../../../utils/colors";

type EntriesDialogProps = {
    open: boolean;
    handleClose: () => void;
    dialogTitle: string;
    dialogDescription: string;
    onSubmit: () => void;
}

export const EntriesDialog:React.FC<EntriesDialogProps> = ({open, handleClose, dialogTitle, dialogDescription, onSubmit}) => {
  return (
    <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{elevation:1}}
    >
        <DialogTitle>
            {dialogTitle}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                {dialogDescription}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button sx={{color: secondaryLight}} onClick={handleClose}>Cancel</Button>
            <Button sx={{color: secondaryLight}} onClick={onSubmit} autoFocus>Confirm</Button>
        </DialogActions>
    </Dialog>
  )
}
