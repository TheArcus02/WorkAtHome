import { Box, Container, Paper, Button} from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import { useGetDoc } from "../../../hooks/useGetDoc"
import { AuthContextItf, firestoreJobOffer } from "../../../utils/interfaces"
import { Loader } from "../../Loader"
import { styled } from "@mui/styles"
import { OfferPreview } from "./OfferPreview"
import { OfferEditMode } from "./OfferEditMode"

type OfferDetailsProps = {
  initialEditMode?: boolean
}

export const OfferDetails:React.FC<OfferDetailsProps> = ({initialEditMode}) => {

  const [offer, setOffer] = useState<firestoreJobOffer | null>(null)
  const [editable, setEditable] = useState(false)
  const [editMode, setEditMode] = useState(initialEditMode || false)
  const [loading, setLoading] = useState(true)

  const { currentUser } = useAuth() as AuthContextItf
  const { document, getDocument } = useGetDoc()
  const params = useParams()
  const { uid } = params

  useEffect(() => {
    if (uid) {
      setLoading(true)
      getDocument("Offers", uid)
    }
  }, [uid])

  useEffect(() => {
    if (document) {
      setOffer(document as firestoreJobOffer)
    }
  }, [document])

  useEffect(() => {
    if (offer && currentUser) {
      offer.createdBy === currentUser.uid && setEditable(true)
      setLoading(false)
    }
  }, [offer, currentUser])

  const StyledButton = styled(Button)(({ theme }: any) => ({
    textTransform: 'none'
  }));

  return offer && !loading ? (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {editable &&
        <Box sx={{ display: 'flex' }}>
          <Paper
            component={editMode ? StyledButton : Paper}
            variant={editMode ? "outlined" : "elevation"}
            elevation={editMode ? 0 : 1}
            sx={{
              boxShadow: 0,
              height: 45,
              borderRadius: "20px 20px 0 0",
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '30%',
              fontSize: 16,
              transition: 'cubic-bezier(0.4, 0, 0.2, 1) 0ms, 150ms'
            }}
            onClick={editMode ? () => setEditMode(false) : null}
          >
            Preview
          </Paper>
          <Paper
            component={!editMode ? StyledButton : Paper}
            variant={!editMode ? "outlined" : "elevation"}
            elevation={!editMode ? 0 : 1}
            sx={{
              boxShadow: 0,
              height: 45,
              borderRadius: "20px 20px 0 0",
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '30%',
              textTransform: 'none',
              fontSize: 16,
              transition: 'cubic-bezier(0.4, 0, 0.2, 1) 0ms, 150ms'

            }}
            onClick={!editMode ? () => setEditMode(true) : null}
          >
            Edit
          </Paper>
        </Box>
      }
      <Paper sx={{ py: 5, borderTopLeftRadius: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'justify' }} mx={5}>
          {!editMode ? (
            <OfferPreview editable={editable} offer={offer} />
          ) : <OfferEditMode offer={offer} />}
        </Box>
      </Paper>


    </Container>
  ) : (<Loader />)
}
