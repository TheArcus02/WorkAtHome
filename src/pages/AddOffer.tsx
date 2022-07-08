import { Cancel } from '@mui/icons-material'
import { Box, Container, Paper, Typography, Grid, TextField, Select, MenuItem, InputLabel, Stack } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { secondary } from '../utils/colors'

type tagsProps = {
    tag: string;
    handleDelete: (val: string) => void
}
const Tags: React.FC<tagsProps> = ({ tag, handleDelete }) => {
    return (
        <Box sx={{ background: secondary, height: "100%", display: 'flex', p: 1, m: 1, ml:0, justifyContent: 'center', alignContent: 'center' }}>
            <Stack direction='row' gap={1}>
                <Typography>{tag}</Typography>
                <Cancel sx={{ cursor: "pointer" }} onClick={() => handleDelete(tag)} />
            </Stack>
        </Box>
    )
}

export const AddOffer = () => {

    const [tags, setTags] = useState<string[]>([])

    const tagRef = useRef<HTMLInputElement>()

    const useStyles = makeStyles(() => ({
        tagsField: {
            display:'flex',
            flexWrap:'wrap',
        }
    }))
    const classes = useStyles()

    const handleAddTag = (e:React.KeyboardEvent) => {
        if(e.key === "Enter" && tagRef.current) {
            if(tags.includes(tagRef.current.value)){
                return toast.warn("Tag already included")
            }
            setTags([...tags, tagRef.current.value])
            tagRef.current.value = ""
        }
    }
    
    const handleDeleteTag = (val:string) => {
        setTags(tags.filter((tag) => tag!== val))
    }

    return (
        <Container maxWidth="sm" sx={{ mb: 4 }} >
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">
                    Add Offer
                </Typography>
                <Box component="form" onSubmit={() => undefined} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="title"
                                name="title"
                                label="Title"
                                fullWidth
                                autoComplete="title"
                                variant="standard"
                            // onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="company-label">Comapny</InputLabel>
                            <Select
                                labelId='company-label'
                                label="Comapny"
                                id="company"
                                value=''
                                fullWidth
                                variant='standard'
                                required
                            // onChange={}
                            >
                                <MenuItem value="">
                                </MenuItem>
                                // TODO map user companies
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="seniority-label">Seniority</InputLabel>
                            <Select
                                labelId='seniority-label'
                                label="Seniority"
                                id="seniority"
                                // value={}
                                fullWidth
                                variant='standard'
                                required
                            // onChange={}
                            >
                                <MenuItem value="">
                                </MenuItem>
                                <MenuItem value='junior'>Junior</MenuItem>
                                <MenuItem value='mid'>Mid</MenuItem>
                                <MenuItem value='senior'>Senior</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputRef={tagRef}
                                variant='standard'
                                label="Tech stack"
                                placeholder={tags.length < 5 ? "Enter tags"  : ''}
                                onKeyDown={(e) => handleAddTag(e)}
                                sx={{display:'flex', flexWrap: 'wrap', width:'502px'}}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ display: 'flex', flexWrap:'wrap'}}>
                                            {tags.map((tag, index) => (
                                                <Tags tag={tag} handleDelete={handleDeleteTag} key={tag + index} />
                                            ))}
                                        </Box>
                                    ),
                                    className: classes.tagsField
                                }}
                            />


                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="minSalary"
                                name="minSalary"
                                label="Min Salary"
                                fullWidth
                                autoComplete="minSalary"
                                variant="standard"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="maxSalary"
                                name="maxSalary"
                                label="Max Salary"
                                fullWidth
                                autoComplete="minSalary"
                                variant="standard"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="description"
                                name="description"
                                label="Description"
                                multiline
                                fullWidth
                                maxRows={6}
                                minRows={4}
                            // onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}


/*
    createdBy: string;
    createdAt: Timestamp;
    description: string;
    technologies: string[];
    company: baseCompanyInfo;
    location: string;
    minSalary: number;
    maxSalary: number;
    seniority: string;
    title: string;
    entries: string[];
*/