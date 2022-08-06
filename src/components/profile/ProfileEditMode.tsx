import { Box, Grid, TextField, Typography, Button, Container, Avatar, Divider, InputAdornment } from "@mui/material"
import { useEffect, useState } from "react"
import { useValidateInputs } from "../../hooks/useValidateInputs"
import { firestoreUser } from "../../utils/interfaces"
import { v4 } from 'uuid'
import { Loader } from "../Loader"
import { useSetDoc } from "../../hooks/useSetDoc"
import { toast } from "react-toastify"
import { getSocialIcon } from "./SocialLink"
import { useImageUpload } from "../../hooks/useImageUpload"


type formDataType = Pick<firestoreUser, "displayName" | "description">
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
  const [formData, setFormData] = useState<formDataType>({ displayName, description })
  const [socials, setSocials] = useState<Isocials | null>(null)
  const [imageUpload, setImageUpload] = useState<File | null>(null)

  const { validateData, inputErrors, errors, validated, setValidated } = useValidateInputs()
  const { setDocument } = useSetDoc()
  const { image, imageUploading, uploadImage, deleteImage } = useImageUpload()

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

    if (validated && socials) {
      if (errors) {
        setValidated(false)
        return
      }
      if (imageUpload) {
        if (!imageUploading) {
          uploadImage(imageUpload, `Profiles/${userUid}/${imageUpload.name + v4() + userUid}`)
        } else {
          toast.warning("Other image is already uploading. You can't upload another until the first is done.")
        }
      }

      const socialsEntries = Object.entries(socials).map((social) => (
        social[1]?.length === 0 ? null : { link: social[1], name: social[0] }
      )).filter(n => n)


      const data = {
        ...formData,
        socials: [
          ...socialsEntries
        ]
      }
      console.log({ data })
      setDocument("Users", data, userUid)
      setValidated(false)
    }
  }, [validated, errors, socials])


  useEffect(() => {
    if (image) {
      if (userInfo.photoUrl.length > 0) deleteImage(userInfo.photoUrl)
      setDocument("Users", { photoUrl: image }, userUid)
        .then(() => toast.success("Image changed successfully"))
      setImageUpload(null)
    }
  }, [image])



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
    if (!validated) {
      console.log({ ...formData, ...socials })
      validateData({ ...formData, ...socials })
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
              src={userInfo.photoUrl}
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
              error={inputErrors?.displayName.error}
              helperText={inputErrors?.displayName.text}
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
              error={inputErrors?.description.error}
              helperText={inputErrors?.description.text}
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
                    startAdornment: (
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
