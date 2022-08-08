import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useSetDoc } from "../../hooks/useSetDoc";
import { useValidateInputs } from "../../hooks/useValidateInputs";
import { firestoreCompany } from "../../utils/interfaces";

type CompanyEditModeProps = {
  companyInfo: firestoreCompany
}

export const CompanyEditMode: React.FC<CompanyEditModeProps> = ({ companyInfo }) => {
  const { address, description, name, websiteUrl, email } = companyInfo
  const initialFormData: Partial<firestoreCompany> = { email, address, description, name, websiteUrl, }
  
  const [formData, setFormData] = useState<Partial<firestoreCompany>>(initialFormData)
  const [imageUpload, setImageUpload] = useState<File | null>(null)


  const { validateData, inputErrors, errors, validated, setValidated } = useValidateInputs()
  const { setDocument } = useSetDoc()
  const { deleteImage, image, imageUploading, uploadImage } = useImageUpload()

  useEffect(() => {
    if (validated) {
      if (errors) {
        setValidated(false)
        return
      }
      if (imageUpload) {
        if(!imageUploading){
          uploadImage(imageUpload, `Companies/${companyInfo.uid}/${imageUpload.name + v4() + companyInfo.uid}`)
        } else {
          toast.warning("Other image is already uploading. You can't upload another until the first is done.")
        }
      }

      setDocument("Companies", formData, companyInfo.uid)
      setValidated(false)
    }
  }, [validated, errors])

  useEffect(() => {
    if(image){
      if(companyInfo.photoUrl.length > 0) deleteImage(companyInfo.photoUrl)
      setDocument("Companies", {photoUrl: image}, companyInfo.uid)
      .then(() => toast.success("Image changed successfully 🎉"))
      setImageUpload(null)
    }
  }, [image])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validated) {
      validateData(formData)
    }
  }

  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => (
      {
        ...prev,
        [name]: value
      }
    ))
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography component="h1" variant="h4" align="center">
        Edit Compnay
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              error={inputErrors?.name.error}
              helperText={inputErrors?.name.text}
              required
              id="name"
              name="name"
              label="name"
              value={formData.name}
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
              label="address"
              value={formData.address}
              fullWidth
              autoComplete="address"
              variant="standard"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={inputErrors?.email.error}
              helperText={inputErrors?.email.text}
              required
              id="email"
              name="email"
              label="email"
              value={formData.email}
              fullWidth
              autoComplete="email"
              variant="standard"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={inputErrors?.websiteUrl.error}
              helperText={inputErrors?.websiteUrl.text}
              id="websiteUrl"
              name="websiteUrl"
              label="Website"
              value={formData.websiteUrl}
              fullWidth
              autoComplete="websiteUrl"
              variant="standard"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={inputErrors?.description.error}
              helperText={inputErrors?.description.text}
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
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
