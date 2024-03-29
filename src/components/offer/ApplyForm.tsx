import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import { arrayUnion, increment, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "../../hooks/useQuery";
import { useSetDoc } from "../../hooks/useSetDoc";
import { useValidateInputs } from "../../hooks/useValidateInputs";
import { AuthContextItf, firestoreEntry, jobApplication } from "../../utils/interfaces";
import { Loader } from "../Loader";

type formDataType = {
    name: string;
    surname: string;
    introduce: string;
}
type applyFormProps = {
    offerUid: string;
}
export const ApplyForm: React.FC<applyFormProps> = ({ offerUid }) => {

    const [formData, setFormData] = useState<formDataType | null>(null)
    const [alreadyApplied, setAlreadyApplied] = useState(false)

    const { userInfo, currentUser } = useAuth() as AuthContextItf
    const { validateData, inputErrors, errors, validated } = useValidateInputs()
    const { setDocument, firebaseDoc: doc, docRef } = useSetDoc()
    const { getQuery, queryResult, unsubscribe } = useQuery()

    useEffect(() => {
        if (userInfo && currentUser) {
            const { name, surname } = userInfo
            const data: formDataType = {
                name, surname, introduce: ''
            }
            setFormData(data)
            getQuery("", `Offers/${offerUid}/entries`, where('userUid', '==', currentUser.uid))
        }

    }, [userInfo, currentUser])

    useEffect(() => {
        if (queryResult) {
            if (!queryResult.empty) {
                setAlreadyApplied(true)
            }
        }
    }, [queryResult])

    useEffect(() => {
        if (validated && currentUser && formData && !alreadyApplied) {
            if (errors) return
            const data: firestoreEntry = {
                ...formData,
                userUid: currentUser.uid,
                createdAt: new Date(),
                approved: false,
                rejected: false,
                uid: '',
                active: true,
            }
            setDocument('Offers', { entriesCounter: increment(1) }, offerUid)
            setDocument(`Offers/${offerUid}/entries`, data, undefined, "Entries")
            setAlreadyApplied(true)
        }
    }, [errors, validated, currentUser, formData, alreadyApplied])

    useEffect(() => {
        if (doc && currentUser && docRef) {
            if (docRef === "Entries") {
                const jobApplicationObj: jobApplication = {
                    entryUid: doc.id,
                    offerUid
                }
                setDocument("Users", { jobApplications: arrayUnion(jobApplicationObj) }, currentUser.uid)
                setDocument(`Offers/${offerUid}/entries`, { uid: doc.id }, doc.id).then(() => (
                    toast.success(`Your apply has been send. 🎉`)
                ))
            }
        }
    }, [doc, currentUser, docRef])

    useEffect(() => {
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [unsubscribe])



    const handleChange = (name: string, value: string) => {
        setFormData((prev: any) => (
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData) {
            validateData(formData)
        }
    }

    return (
        !alreadyApplied ? (
            formData ? (
                <Box component="form" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                error={inputErrors?.name.error}
                                helperText={inputErrors?.name.text}
                                required
                                id="name"
                                name="name"
                                label="Name"
                                value={formData.name}
                                fullWidth
                                autoComplete="name"
                                variant="standard"
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                error={inputErrors?.surname.error}
                                helperText={inputErrors?.surname.text}
                                required
                                id="surname"
                                name="surname"
                                label="Surname"
                                value={formData.surname}
                                fullWidth
                                autoComplete="surname"
                                variant="standard"
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                multiline
                                maxRows={6}
                                minRows={4}
                                error={inputErrors?.introduce.error}
                                helperText={inputErrors?.introduce.text}
                                required
                                id="introduce"
                                name="introduce"
                                label="Introduce yourself"
                                value={formData.introduce}
                                fullWidth
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ mt: 3, ml: 1, color: '#fff' }}
                            color="success"
                        >
                            Apply
                        </Button>
                    </Box>
                </Box>
            ) : (<Loader />)
        ) : (<Typography align="center" mt={2}>You already applied for this job</Typography>)

    )
}
