import { Work } from "@mui/icons-material"
import { Box, Paper, Typography, Divider, Card, CardHeader } from "@mui/material"
import { styled } from "@mui/styles"
import moment from "moment"
import { baseJobInfo } from "../../utils/interfaces"

type ExperienceProps = {
    jobs: baseJobInfo[]
}

export const Experience:React.FC<ExperienceProps> = ({jobs}) => {
    
    const getDate = (startedAt: any, endedAt: any) => {
        return !endedAt ? 
        moment(startedAt.toDate()).format('LL') + " - Now": 
        moment(startedAt.toDate()).format('LL') + " - " + moment(endedAt.toDate()).format('LL')
    }

    const CardsContainer = styled(Box)(({ theme }:any) => ({
        display:'flex', 
        flexDirection:'column', 
        alignItems:'flex-start', 
        position:'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            height: '100%',
            width: '2px',
            transform: 'translateX(-50%)',
            left: '50%',
            backgroundColor: theme.palette.secondary.light,
        },
    }));


    const StyledCard = styled(Card)(({ theme }:any) => ({
        maxWidth: 345,
    }));
    // ? change to mui timeline from lab lib
    return (
        <Paper elevation={0} sx={{ p:2, mt:2 }} >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Work />
                <Typography variant="h5" ml={1}>Experience</Typography>
            </Box>
            <Divider />
            <CardsContainer sx={{ mx:10, my:5 }}>
                {jobs.map((job, index) => (
                    <StyledCard 
                        sx={index%2==0 ? undefined : {alignSelf:'flex-end'}} 
                        component={Paper} 
                        elevation={10} 
                        key={job.companyUid + index}>
                        <CardHeader 
                            title={job.title} 
                            subheader={
                            <Box>
                                <Typography variant="subtitle2">{job.companyName}</Typography>
                                {getDate(job.startedAt, job.endedAt)}
                            </Box>
                            }  
                            subheaderTypographyProps={{textAlign:'center'}}    
                            titleTypographyProps={{textAlign:'center'}}    
                        />
                    </StyledCard>
                    
                ))}
            </CardsContainer>
        </Paper>

    )
}