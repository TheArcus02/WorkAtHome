import { Button, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { storage } from '../firebase/firebase.config'
import { useValidateInputs } from '../hooks/useValidateInputs'
import { v4 } from 'uuid'
import { useSetDoc } from '../hooks/useSetDoc'
import { useAuth } from '../contexts/AuthContext'
import { AuthContextItf, baseCompanyInfo, firestoreCompany } from '../utils/interfaces'
import { toast } from 'react-toastify'
import { arrayUnion } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export const CreateCompany = () => {

    const defaultFormData = {
        name: '',
        address: '',
        description: '',
        photoUrl: '',
        websiteUrl: '',
        email: '',
    }
    const [formData, setFormData] = useState(defaultFormData)
    const [imageUpload, setImageUpload] = useState<File | null>(null)

    const { currentUser } = useAuth() as AuthContextItf
    const { validateData, inputErrors, errors, validated } = useValidateInputs()
    const { setDocument, firebaseDoc: doc } = useSetDoc()
    const navigate = useNavigate()

    useEffect(() => {
        if (validated && currentUser) {
            if (errors) return
            if (imageUpload) {
                uploadImage()
                return
            }
            const documentData: firestoreCompany = {
                ...formData,
                photoUrl: "https://firebasestorage.googleapis.com/v0/b/workathome-1389e.appspot.com/o/placeholders%2Fcompany_placeholder.jpg?alt=media&token=542aa3b0-4e6a-4b84-9813-f62364e0a12e",
                createdBy: currentUser.uid,
                employees: [],
                active: true,
                size: 0,
                uid:''
            }
            setDocument("Companies", documentData)
        }

    }, [validated, errors])

    useEffect(() => {
        if (currentUser && formData.photoUrl) {
            const documentData: firestoreCompany = {
                ...formData,
                createdBy: currentUser.uid,
                employees: [],
                active: true,
                size: 0,
                uid:''
            }
            setDocument("Companies", documentData)
        }
    }, [formData.photoUrl])

    useEffect(() => {
        if (doc && currentUser) {
            const companyInfo:baseCompanyInfo = {name:formData.name, uid:doc.id} 

            setDocument("Companies", {uid:doc.id}, doc.id);

            setDocument("Users", {companies: arrayUnion(companyInfo)}, currentUser.uid).then(() => {
                toast.success("Company added successfuly")
                navigate(`/company/${doc.id}`)
            }
            ).catch(() => toast.error("Erorr ocured when adding company."))
        }
    }, [doc])


    const handleChange = (name: string, value: string) => {
        setFormData((prev) => (
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        validateData(formData)
    };

    const uploadImage = () => {
        if (imageUpload) {
            const imageRef = ref(storage, `Companies/${imageUpload.name + v4()}`)
            uploadBytes(imageRef, imageUpload).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('downloadURL => ', downloadURL)
                    setFormData((prev) => (
                        {
                            ...prev,
                            'photoUrl': downloadURL
                        }
                    ))
                })
            })
        }
    }

    return (
        <Container
            maxWidth="sm"
            sx={{ mb: 4 }}
        >
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">
                    Add company
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="name"
                                name="name"
                                label="Name"
                                fullWidth
                                autoComplete="name"
                                variant="standard"
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                id="address"
                                name="address"
                                label="Address"
                                fullWidth
                                autoComplete="address"
                                variant="standard"
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="email"
                                name="email"
                                label="Email"
                                fullWidth
                                autoComplete="email"
                                variant="standard"
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="websiteUrl"
                                name="websiteUrl"
                                label="Website"
                                fullWidth
                                autoComplete="website"
                                variant="standard"
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
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
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>Photo:</Typography>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Upload File
                                    <input
                                        multiple={false}
                                        type="file"
                                        accept='image/*'
                                        hidden
                                        onChange={(e) => setImageUpload(e.target.files ? e.target.files[0] : null)}
                                    />
                                </Button>
                            </Box>
                            {imageUpload && <Typography mt={2}>Uploaded image: {imageUpload.name}</Typography>}
                        </Grid>



                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            // onClick={handleNext}
                            sx={{ mt: 3, ml: 1, color: '#fff' }}
                            color="success"
                        >
                            Create
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}
