import { Box, Container, Paper, Alert, Button} from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader } from '../components/Loader'
import { useAuth } from '../contexts/AuthContext'
import { useSetDoc } from '../hooks/useSetDoc'
import { useValidateInputs } from '../hooks/useValidateInputs'
import { AuthContextItf, firestoreJobOffer, offerForm } from '../utils/interfaces'
import { OfferForm } from '../components/offer/OfferForm'



export const AddOffer = () => {

    const [formData, setFormData] = useState<offerForm | null>(null)
    const [tags, setTags] = useState<string[]>([])
    const [noCompanies, setNoCompanies] = useState(false)

    
    const { userInfo, currentUser } = useAuth() as AuthContextItf
    const navigate = useNavigate()
    const { validateData, inputErrors, errors, validated } = useValidateInputs()
    const { setDocument, firebaseDoc: doc } = useSetDoc()

    useEffect(() => {
        if (userInfo) {
            if (userInfo.companies.length > 0) {
                const initialformData: offerForm = {
                    title: '',
                    location: '',
                    companyUid: userInfo.companies[0].uid,
                    description: '',
                    maxSalary: '',
                    minSalary: '',
                    seniority: 'Junior'
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
                companyName: userInfo.companies.find((company) => company.uid === formData.companyUid)?.name as string,
                minSalary: parseInt(formData.minSalary),
                maxSalary: parseInt(formData.maxSalary),
                createdBy: currentUser.uid,
                createdAt: new Date(),
                technologies: tags,
                entriesCounter: 0,
                uid: '',
                active: true
            }
            setDocument("Offers", documentData).then(() => {
                toast.success("Offer created succesfully! 🎉")
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
    
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(formData){
            validateData(formData)
        }
    }


    return (
        <Container maxWidth="sm" sx={{ mb: 4 }}>
            {formData && userInfo ? (
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <OfferForm 
                        formData={formData} 
                        setFormData={setFormData} 
                        tags={tags}
                        setTags={setTags}
                        handleSubmit={handleSubmit} 
                        inputErrors={inputErrors}
                        userInfo={userInfo}
                    />
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