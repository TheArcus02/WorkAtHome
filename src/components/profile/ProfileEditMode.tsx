import { Box, Grid, TextField, Typography, Button, Container, Avatar, Divider } from "@mui/material"
import { useEffect, useState } from "react"
import { useValidateInputs } from "../../hooks/useValidateInputs"
import { firestoreUser, socialsInfo, socialNames } from "../../utils/interfaces"
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from "../../firebase/firebase.config"
import { Loader } from "../Loader"


type formDataType = Pick<firestoreUser, "displayName" | "description" | "photoUrl">
type ProfileEditModeProps = {
  userInfo: firestoreUser;
  userUid: string;
}
type Isocials = {
  [key: string]: string | undefined
}
const socialOptions: Array<socialNames> = ['facebook', 'twitter', 'instagram', 'website', 'youtube']
export const ProfileEditMode: React.FC<ProfileEditModeProps> = ({ userInfo, userUid }) => {


  const { displayName, description, photoUrl } = userInfo
  const [formData, setFormData] = useState<formDataType>({ displayName, description, photoUrl })
  const [socials, setSocials] = useState<Isocials | null>(null)
  const [imageUpload, setImageUpload] = useState<File | null>(null)


  const { validateData, inputErrors, errors, validated } = useValidateInputs()

  console.log({ formData, socials })

  useEffect(() => {
    socialOptions.forEach((socialOpt) => (
      setSocials((prev: any) => (
        {
          ...prev,
          [socialOpt]: userInfo.socials.find((social) => social.name === socialOpt)?.link 
        }
      ))
    ))
  
  }, [])
  

  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => (
      {
        ...prev,
        [name]: value
      }
    ))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const uploadImage = () => {
    if (imageUpload) {
      const imageRef = ref(storage, `Profiles/${imageUpload.name + v4() + userUid}`)
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


  return socials ? (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography component="h1" variant="h4" align="center">
        Edit Profile
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar alt="Profile Picture" src={userInfo.photoUrl ? userInfo.photoUrl : ""} sx={{ width: 168, height: 168, m: 3, bgcolor: '#fff' }} >
              <Typography fontSize={40}>{!userInfo.photoUrl && userInfo.displayName?.slice(0, 2)}</Typography>
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Profile Photo:</Typography>
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
          <Grid item xs={12}>
              <Divider><Typography variant="h5" >Info</Typography></Divider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={inputErrors?.photoUrl.error}
              helperText={inputErrors?.photoUrl.text}
              required
              id="displayName"
              name="displayName"
              label="Dispaly Name"
              value={formData.displayName}
              fullWidth
              autoComplete="displayName"
              variant="standard"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={inputErrors?.photoUrl.error}
              helperText={inputErrors?.photoUrl.text}
              required
              id="description"
              name="description"
              label="Description"
              value={formData.description}
              fullWidth
              autoComplete="description"
              multiline
              maxRows={6}
              minRows={4}
              variant="standard"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Grid>
          <Grid container item xs={12} spacing={2} mt={2}>
            <Grid item xs={12}>
            <Divider><Typography variant="h5">Socials</Typography></Divider>
            </Grid>
            {socialOptions.map((option, index) => (
              <Grid item xs={12} md={6} key={option + index}>
                <TextField
                  error={inputErrors?.photoUrl.error}
                  helperText={inputErrors?.photoUrl.text}
                  id={option}
                  name={option}
                  label={option}
                  value={socials[option] || ""}
                  fullWidth
                  autoComplete={option}
                  variant="standard"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </Grid>
            ))}
            {/* TODO add icons to inputs */}

          </Grid>
        </Grid>
      </Box>
    </Container>
  ) : <Loader />
}
