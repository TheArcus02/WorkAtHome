import { CircularProgress, Paper } from '@mui/material'


export const Loader = () => {
  return (
    <Paper sx={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
        <CircularProgress size="60px" />
    </Paper>
  )
}

