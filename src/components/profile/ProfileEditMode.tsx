import { Box, Grid, TextField, Typography, Button, Container, Avatar, Divider, InputAdornment } from "@mui/material"
import { useEffect, useState } from "react"
import { useValidateInputs } from "../../hooks/useValidateInputs"
import { firestoreUser, socialsInfo } from "../../utils/interfaces"
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from "../../firebase/firebase.config"
import { Loader } from "../Loader"
import { useSetDoc } from "../../hooks/useSetDoc"
import { toast } from "react-toastify"
import { getSocialIcon } from "./SocialLink"
import { isValidSocialLink } from "../../utils/utils"


type formDataType = Pick<firestoreUser, "displayName" | "description" | "photoUrl">
type ProfileEditModeProps = {
  userInfo: firestoreUser;
  userUid: string;
}
type Isocials = {
  [key: string]: string | undefined
}
const socialOptions: Array<string> = ['facebook', 'twitter', 'instagram', 'website', 'youtube']
export const ProfileEditMode: React.FC<ProfileEditModeProps> = ({ userInfo, userUid }) => {


  const { displayName, description, photoUrl } = userInfo
  const [formData, setFormData] = useState<formDataType>({ displayName, description, photoUrl })
  const [socials, setSocials] = useState<Isocials | null>(null)
  const [imageUpload, setImageUpload] = useState<File | null>(null)
  const [imageUploading, setImageUploading] = useState(false)

  const { validateData, inputErrors, errors, validated, setValidated } = useValidateInputs()
  const { setDocument } = useSetDoc()
  

  useEffect(() => {
    socialOptions.forEach((socialOpt) => (
      setSocials((prev: any) => (
        {
          ...prev,
          [socialOpt]: userInfo.socials.find((social) => social.name === socialOpt)?.link || ""
        }
      ))
    ))

  }, [])
  useEffect(() => {
    const uploadImage = async () => {
      if (imageUpload) {
        setImageUploading(true)
        const imageRef = ref(storage, `Profiles/${userUid}/${imageUpload.name + v4() + userUid}`)
        await uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log('downloadURL => ', downloadURL)
            setFormData((prev) => (
              {
                ...prev,
                'photoUrl': downloadURL
              }
            ))
            setImageUpload(null)
            setImageUploading(false)
          })
        })
      }
    }

    if(validated && socials){
      if(errors) {
        setValidated(false)
        return
      }
      if (imageUpload && !imageUploading) {
        uploadImage()
        .catch((error: any) => toast.error("error ocurred during uploading an image.", error))
      }

      const socialsEntries = Object.entries(socials).map((social) => (
        social[1]?.length === 0 ? null : {link:social[1], name: social[0]}
      )).filter(n => n)
      

      const data = {
        ...formData,
        socials:[
          ...socialsEntries
        ]
      }
      console.log({data})
      setDocument("Users", data, userUid)
      setValidated(false)
    }
  }, [validated, errors, socials])

  useEffect(() => {
    if(formData.photoUrl && formData.photoUrl !== userInfo.photoUrl){
      setDocument("Users", {photoUrl: formData.photoUrl}, userUid)
    }
  }, [formData.photoUrl])
  


  const handleChange = (name: string, value: string) => {
    if (socialOptions.includes(name)) {
      setSocials((prev: any) => (
        {
          ...prev,
          [name]: value
        }
      ))
    } else {
      setFormData((prev: any) => (
        {
          ...prev,
          [name]: value
        }
      ))
    }

  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(!validated){
      console.log({ ...formData, ...socials })
      validateData({...formData, ...socials })
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
            <Avatar 
              alt="Profile Picture" 
              src={formData.photoUrl ? formData.photoUrl : userInfo.photoUrl ? userInfo.photoUrl : ""} 
              sx={{ width: 168, height: 168, m: 3, bgcolor: '#fff' }} 
            >
              <Typography fontSize={40}>
                {!userInfo.photoUrl && userInfo.displayName?.slice(0, 2)}
              </Typography>
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
          <Grid item xs={12} my={1}>
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
            <Grid item xs={12} my={1}>
              <Divider><Typography variant="h5">Socials</Typography></Divider>
            </Grid>
            {socialOptions.map((option, index) => (
              <Grid item xs={12} md={6} key={option + index}>
                <TextField
                  error={inputErrors?.[option].error}
                  helperText={inputErrors?.[option].text}
                  id={option}
                  name={option}
                  label={option.charAt(0).toUpperCase() + option.slice(1)}
                  value={socials[option] || ""}
                  fullWidth
                  autoComplete={option}
                  variant="standard"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  InputProps={{
                    startAdornment:(
                      <InputAdornment position="start">
                        {getSocialIcon(option, "small")}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            ))}
            {/* TODO add icons to inputs */}

          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 5, ml: 1, color: '#fff' }}
            color="warning"
          >
            Edit
          </Button>
        </Box>
      </Box>
    </Container>
  ) : <Loader />
}
