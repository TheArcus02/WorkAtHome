import { Box, Container,IconButton, InputAdornment, OutlinedInput, Paper, Typography } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
export const Home:React.FC = () => {
    return(
            <Container sx={{mt:5}}>
                <Paper sx={{p:6, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}} >
                    <Typography variant="h4" component="h2" gutterBottom>
                        Search over 10k job offers from the entire world.
                    </Typography>
                    <OutlinedInput 
                        id="job-search"
                        type="text"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton edge="end">
                                    <SearchOutlinedIcon color="primary"/>
                                </IconButton>
                            </InputAdornment>
                        }
                        fullWidth
                        placeholder="Look for remote job"
                        sx={{
                            width:'75%'
                        }}
                    />
                </Paper>
            </Container>
    )
}