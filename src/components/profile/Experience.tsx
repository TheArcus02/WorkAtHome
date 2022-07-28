import { AccessTimeOutlined, BusinessOutlined, Work } from "@mui/icons-material"
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab"
import { Box, Paper, Typography, Divider, Card, CardHeader, FormControlLabel, Switch } from "@mui/material"
import { styled } from "@mui/styles"
import moment from "moment"
import { useState } from "react"
import { secondaryLight} from "../../utils/colors"
import { baseJobInfo } from "../../utils/interfaces"

type ExperienceProps = {
    jobs: baseJobInfo[]
}

export const Experience:React.FC<ExperienceProps> = ({jobs}) => {
    const [labTimeline, setLabTimeline] = useState(true)
    const getDate = (startedAt: any, endedAt: any) => {
        return !endedAt ? 
        moment(startedAt.toDate()).format('LL') + " - Now": 
        moment(startedAt.toDate()).format('LL') + " - " + moment(endedAt.toDate()).format('LL')
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabTimeline(!e.target.checked)
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
    
    return (
        <Paper elevation={0} sx={{ p:2, mt:2 }} >
            <Box sx={{ display:'flex', justifyContent:'space-between', mb: 1.5 }}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Work />
                    <Typography variant="h5" ml={1}>Experience</Typography>
                </Box>
                <Box>
                    <FormControlLabel control={<Switch color="secondary" onChange={handleOnChange} />} label="Disable Mui Lab Timline" labelPlacement="start" />
                </Box>
            </Box>
            <Divider />
            {!labTimeline ? (
                <CardsContainer sx={{ mx:10, my:5 }}>
                    {jobs.map((job, index) => (
                        <Card 
                            sx={index%2==0 ? {maxWidth:345} : {alignSelf:'flex-end', maxWidth:345}} 
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
                        </Card>
                        
                    ))}
                </CardsContainer>
            ) : (
                <Timeline position="alternate">
                    {jobs.map((job, index) => (
                        <TimelineItem key={job.companyUid + index}>
                            <TimelineSeparator>
                                <TimelineDot color="secondary" />
                                <TimelineConnector sx={{minHeight:70, bgcolor:secondaryLight}} />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="h6" component="span">
                                    {job.title}
                                </Typography>
                                
                                <Box py={0.3} sx={index%2==0 ? {display:'flex', alignItems:'center'} : {display:'flex', alignItems:'center', flexDirection:'row-reverse'}} color="text.secondary" >
                                    <AccessTimeOutlined fontSize="small" />
                                    <Typography variant="body2" mx={0.5}> 
                                    {getDate(job.startedAt, job.endedAt)}</Typography>
                                </Box>
                                <Box py={0.3} sx={index%2==0 ? {display:'flex', alignItems:'center'} : {display:'flex', alignItems:'center', flexDirection:'row-reverse'}} color="text.secondary" >
                                    <BusinessOutlined  fontSize="medium"/>
                                    <Typography variant="subtitle2" color="text.secondary" mx={0.5} >
                                        {job.companyName}
                                    </Typography>
                                </Box>
                                
                                
                            </TimelineContent>
                            
                        </TimelineItem>
                    ))}
                    


                </Timeline>
            )}
            
        </Paper>

    )
}