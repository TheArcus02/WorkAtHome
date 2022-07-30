import { Box, Container,} from "@mui/material"
import { useEffect, useState} from "react";
import { toast } from "react-toastify";
import { useSetDoc } from "../../../hooks/useSetDoc";
import { useValidateInputs } from "../../../hooks/useValidateInputs";
import { firestoreJobOffer, firestoreUser, offerForm, seniority } from "../../../utils/interfaces"
import { OfferForm } from "../OfferForm";

type OfferEditModeProps = {
    offer: firestoreJobOffer;
    userInfo: firestoreUser;
}
type formDataType = {
    title: string;
    location: string;
    companyUid: string;
    seniority: seniority;
    minSalary: string;
    maxSalary: string;
    description: string;
}

export const OfferEditMode: React.FC<OfferEditModeProps> = ({ offer, userInfo }) => {
    const {title, location, companyUid, seniority, minSalary, maxSalary, description } = offer
    const initialFormData: formDataType = {
        title, location, companyUid, seniority, minSalary: minSalary.toString(), maxSalary: maxSalary.toString(), description
    }
    
    const [formData, setFormData] = useState<offerForm | null>(initialFormData)
    const [tags, setTags] = useState<string[]>(offer.technologies)

    const { validateData, inputErrors, errors, validated, setValidated } = useValidateInputs()
    const { setDocument } = useSetDoc()

    useEffect(() => {
        if(validated){
          if(errors) return
          if(formData && userInfo){
              const documentData = {
                  ...formData,
                  companyName: userInfo.companies.find((company) => company.uid === formData.companyUid)?.name as string,
                  minSalary: parseInt(formData.minSalary),
                  maxSalary: parseInt(formData.maxSalary),
                  technologies: tags,
              }
              setDocument("Offers", documentData, offer.uid).then(() => {
                  toast.success("Offer edited succesfully!")
              }).catch((error) => (toast.error("Error ocurred during editing offer in database: " + error)))
            }
            setValidated(false)
        }
      }, [validated, errors])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(formData){
            validateData(formData)
        }
    }

    return formData &&(
        <Container maxWidth="md">
            <OfferForm 
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                inputErrors={inputErrors}
                tags={tags}
                setTags={setTags}
                userInfo={userInfo}
                editMode={true}
            />
        </Container>
    )
}
