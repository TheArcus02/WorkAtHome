import { Button, Container, Grid, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useValidateInputs } from '../hooks/useValidateInputs'
import { v4 } from 'uuid'
import { useSetDoc } from '../hooks/useSetDoc'
import { useAuth } from '../contexts/AuthContext'
import { AuthContextItf, baseCompanyInfo, firestoreCompany } from '../utils/interfaces'
import { toast } from 'react-toastify'
import { arrayUnion } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useImageUpload } from '../hooks/useImageUpload'

export const CreateCompany = () => {

    const defaultFormData = {
        name: '',
        address: '',
        description: '',
        websiteUrl: '',
        email: '',
    }
    const [formData, setFormData] = useState(defaultFormData)
    const [imageUpload, setImageUpload] = useState<File | null>(null)


    const { currentUser } = useAuth() as AuthContextItf
    const { validateData, inputErrors, errors, validated, setValidated } = useValidateInputs()
    const { setDocument, firebaseDoc: doc } = useSetDoc()
    const navigate = useNavigate()
    const { image, imageUploading, uploadImage } = useImageUpload()

    useEffect(() => {
        if (validated && currentUser) {
            if (errors) {
                setValidated(false)
                return
            }
            const documentData: firestoreCompany = {
                ...formData,
                photoUrl: "https://firebasestorage.googleapis.com/v0/b/workathome-1389e.appspot.com/o/placeholders%2Fcompany_placeholder.jpg?alt=media&token=542aa3b0-4e6a-4b84-9813-f62364e0a12e",
                createdBy: currentUser.uid,
                employees: [],
                active: true,
                size: 0,
                uid: ''
            }
            setDocument("Companies", documentData)
            setValidated(false)
        }

    }, [validated, errors])


    useEffect(() => {
        if (image && doc) {
            setDocument("Companies", { photoUrl: image }, doc.id)
            .then(() => {
                toast.success("Company added successfuly. 🏢🎉")
                navigate(`/company/${doc.id}`)
            })
            
        }
    }, [image, doc])


    useEffect(() => {
        if (doc && currentUser) {

            const companyInfo: baseCompanyInfo = { name: formData.name, uid: doc.id }

            setDocument("Companies", { uid: doc.id }, doc.id);
            setDocument("Users", { companies: arrayUnion(companyInfo) }, currentUser.uid)
                .catch(() => toast.error("Erorr ocured when adding company."))

            if (imageUpload && !imageUploading) {
                toast.info("Company created. You will be navigated when image uploading will be finished.")
                uploadImage(imageUpload, `Companies/${companyInfo.uid}/${imageUpload.name + v4() + companyInfo.uid}`)
            } else {
                toast.success("Company added successfuly. 🏢🎉")
                navigate(`/company/${doc.id}`)
            }
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
                                error={inputErrors?.name.error}
                                helperText={inputErrors?.name.text}
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
                                error={inputErrors?.address.error}
                                helperText={inputErrors?.address.text}
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
                                error={inputErrors?.email.error}
                                helperText={inputErrors?.email.text}
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
                                error={inputErrors?.websiteUrl.error}
                                helperText={inputErrors?.websiteUrl.text}
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
                                error={inputErrors?.description.error}
                                helperText={inputErrors?.description.text}
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
