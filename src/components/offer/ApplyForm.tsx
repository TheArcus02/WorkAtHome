import { Box, Button, Grid, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useValidateInputs } from "../../hooks/useValidateInputs";
import { AuthContextItf } from "../../utils/interfaces";
import { Loader } from "../Loader";

type formDataType = {
    name: string;
    surname: string;
    introduce: string;
}
// type applyFormProps = {
//     entries: 
// }
export const ApplyForm = () => {

    const [formData, setFormData] = useState<formDataType | null>(null)

    const { userInfo } = useAuth() as AuthContextItf
    const { validateData, inputErrors, errors, validated } = useValidateInputs()


    useEffect(() => {
        if (userInfo) {
            const { name, surname } = userInfo
            const data: formDataType = {
                name, surname, introduce: ''
            }
            setFormData(data)
        }

    }, [userInfo])

    useEffect(() => {
      if(validated){
        if(errors) return
        console.log(formData)
        // TODO handle saving entrie into job offer
      }
    }, [errors, validated])
    

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

    // TODO check if user already in entries then display edit instead of apply

    return (
        formData ? (
            <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
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
        
    )
}
