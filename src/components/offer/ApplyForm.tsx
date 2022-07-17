import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import { where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "../../hooks/useQuery";
import { useSetDoc } from "../../hooks/useSetDoc";
import { useValidateInputs } from "../../hooks/useValidateInputs";
import { AuthContextItf, firestoreEntry } from "../../utils/interfaces";
import { Loader } from "../Loader";

type formDataType = {
    name: string;
    surname: string;
    introduce: string;
}
type applyFormProps = {
    uid: string;
}
export const ApplyForm:React.FC<applyFormProps> = ({ uid }) => {

    const [formData, setFormData] = useState<formDataType | null>(null)
    const [alreadyApplied, setAlreadyApplied] = useState(false)

    const { userInfo, currentUser } = useAuth() as AuthContextItf
    const { validateData, inputErrors, errors, validated } = useValidateInputs()
    const { setDocument } = useSetDoc()
    const { getQuery, queryResult } = useQuery()

    useEffect(() => {
        if (userInfo && currentUser) {
            const { name, surname } = userInfo
            const data: formDataType = {
                name, surname, introduce: ''
            }
            setFormData(data)
            getQuery("", `Offers/${uid}/entries`,where('userUid', '==', currentUser.uid))
        }

    }, [userInfo, currentUser])

    useEffect(() => {
      if(queryResult){
        if(!queryResult.empty){
            setAlreadyApplied(true)
        }
      }
    }, [queryResult])
    

    useEffect(() => {
      if(validated && currentUser && formData && !alreadyApplied){
        if(errors) return
        const data:firestoreEntry = {
            ...formData,
            userUid: currentUser.uid
        }
        setDocument(`Offers/${uid}/entries`, data)
        setAlreadyApplied(true)
      }
    }, [errors, validated, currentUser, formData, alreadyApplied])
    

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
        if(formData){
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
                                label="surname"
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
