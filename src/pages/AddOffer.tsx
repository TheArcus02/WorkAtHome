import { Cancel } from '@mui/icons-material'
import { Box, Container, Paper, Typography, Grid, TextField, Select, MenuItem, InputLabel, Stack, Alert, AlertTitle, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { serverTimestamp } from 'firebase/firestore'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader } from '../components/Loader'
import { useAuth } from '../contexts/AuthContext'
import { useSetDoc } from '../hooks/useSetDoc'
import { useValidateInputs } from '../hooks/useValidateInputs'
import { secondary } from '../utils/colors'
import { AuthContextItf, baseCompanyInfo, firestoreJobOffer, seniority } from '../utils/interfaces'

type tagsProps = {
    tag: string;
    handleDelete: (val: string) => void
}
type formDataType = {
    title: string;
    location: string;
    company: string;
    seniority: seniority;
    minSalary: string;
    maxSalary: string;
    description: string;
}
const Tags: React.FC<tagsProps> = ({ tag, handleDelete }) => {
    return (
        <Box sx={{ background: secondary, height: "100%", display: 'flex', p: 1, m: 1, ml: 0, justifyContent: 'center', alignContent: 'center' }}>
            <Stack direction='row' gap={1}>
                <Typography>{tag}</Typography>
                <Cancel sx={{ cursor: "pointer" }} onClick={() => handleDelete(tag)} />
            </Stack>
        </Box>
    )
}

export const AddOffer = () => {

    const [formData, setFormData] = useState<formDataType | null>(null)
    const [tags, setTags] = useState<string[]>([])
    const [noCompanies, setNoCompanies] = useState(false)
    const tagRef = useRef<HTMLInputElement>()

    const useStyles = makeStyles(() => ({
        tagsField: {
            display: 'flex',
            flexWrap: 'wrap',
        }
    }))
    const { userInfo, currentUser } = useAuth() as AuthContextItf
    const navigate = useNavigate()
    const classes = useStyles()
    const { validateData, inputErrors, errors, validated } = useValidateInputs()
    const { setDocument, firebaseDoc: doc } = useSetDoc()

    useEffect(() => {
        if (userInfo) {
            if (userInfo.companies.length > 0) {
                const initialformData: formDataType = {
                    title: '',
                    location: '',
                    company: userInfo.companies[0].uid,
                    description: '',
                    maxSalary: '',
                    minSalary: '',
                    seniority: 'junior'
                }
                setFormData(initialformData)
            } else {
                setNoCompanies(true)
            }

        }
    }, [userInfo])

    useEffect(() => {
      if(validated){
        if(errors) return
        if(formData && currentUser && userInfo){
            const documentData:firestoreJobOffer = {
                ...formData,
                company: userInfo.companies.find((company) => company.uid === formData.company) as baseCompanyInfo,
                minSalary: parseInt(formData.minSalary),
                maxSalary: parseInt(formData.maxSalary),
                createdBy: currentUser.uid,
                createdAt: new Date(),
                technologies: tags,
                entries: [],
                uid: ''
            }
            setDocument("Offers", documentData).then(() => {
                toast.success("Offer created succesfully!")
            }).catch((error) => (toast.error("Error ocurred during adding offer to database: " + error)))
        }
      }
    }, [validated, errors])

    useEffect(() => {
      if(doc){
        setDocument("Offers", {uid:doc.id}, doc.id).then(() => (
            navigate(`/offer/${doc.id}`)
        ))

      }
    }, [doc])
    
    // TODO navigate to offer detials page when it will be ready
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(formData){
            validateData(formData)
        }
    }

    const handleChange = (name: string, value: string) => {
        setFormData((prev:any) => (
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagRef.current) {
            if (tags.includes(tagRef.current.value)) {
                return toast.warn("Tag already included.")
            }
            if(tagRef.current.value.trim().length === 0){
                return toast.warn("Tag is empty.")
            }
            setTags([...tags, tagRef.current.value])
            tagRef.current.value = ""
        }
    }

    const handleDeleteTag = (val: string) => {
        setTags(tags.filter((tag) => tag !== val))
    }

    const checkKeyDown = (e: React.KeyboardEvent) => {
        if(e.key === "Enter") e.preventDefault()
    }

    return (
        <Container maxWidth="sm" sx={{ mb: 4 }}>
            {formData && userInfo ? (
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center">
                        Add Offer
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} onKeyDown={checkKeyDown}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="title"
                                    name="title"
                                    label="Title"
                                    value={formData.title}
                                    fullWidth
                                    autoComplete="title"
                                    variant="standard"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="location"
                                    name="location"
                                    label="Location"
                                    value={formData.location}
                                    fullWidth
                                    autoComplete="location"
                                    variant="standard"
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel id="company-label">Comapny</InputLabel>
                                <Select
                                    labelId='company-label'
                                    label="Comapny"
                                    name="company"
                                    id="company"
                                    value={formData.company}
                                    fullWidth
                                    variant='standard'
                                    required
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                >
                                    {userInfo.companies.map((company) => (
                                        <MenuItem key={company.uid} value={company.uid}>
                                            {company.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel id="seniority-label">Seniority</InputLabel>
                                <Select
                                    labelId='seniority-label'
                                    label="Seniority"
                                    name="seniority"
                                    id="seniority"
                                    value={formData.seniority}
                                    fullWidth
                                    variant='standard'
                                    required
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                >
                                    <MenuItem value='junior'>Junior</MenuItem>
                                    <MenuItem value='mid'>Mid</MenuItem>
                                    <MenuItem value='senior'>Senior</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    inputRef={tagRef}
                                    variant='standard'
                                    name="techStack"
                                    label="Tech stack"
                                    placeholder={tags.length < 5 ? "Enter tags" : ''}
                                    onKeyDown={(e) => handleAddTag(e)}
                                    sx={{ display: 'flex', flexWrap: 'wrap', width: '502px' }}
                                    InputProps={{
                                        startAdornment: (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {tags.map((tag, index) => (
                                                    <Tags tag={tag} handleDelete={handleDeleteTag} key={tag + index} />
                                                ))}
                                            </Box>
                                        ),
                                        className: classes.tagsField
                                    }}
                                />
                                {/* // TODO add transition group */}

                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    value={formData.minSalary}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
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
                                    value={formData.maxSalary}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
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
                                    value={formData.description}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    id="description"
                                    name="description"
                                    label="Description"
                                    multiline
                                    fullWidth
                                    maxRows={6}
                                    minRows={4}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                type="submit"
                                sx={{ mt: 3, ml: 1, color: '#fff' }}
                                color="success"
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            ) : noCompanies ? (
                <Alert 
                    severity='info' 
                    sx={{mt:2, p:2}}
                    action={
                        <Button 
                            variant="contained" 
                            color="info" 
                            size="small"
                            onClick={() => navigate("/create-company")}
                        >
                            Create company
                        </Button> 
                    }
                >
                        You need company to create an offer.
                </Alert>
                
            ) : (<Loader />)}
        </Container>
    )
}