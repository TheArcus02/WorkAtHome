import { DocumentData, getDoc, doc } from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"
import { db } from "../firebase/firebase.config"
import { collections } from "../utils/interfaces"

export const useGetDoc = () => {
    const [document, setDocument] = useState<DocumentData | undefined>(undefined)

    const getDocument = async(collection:collections, id:string) => {
        await getDoc(doc(db, collection, id))
            .then((doc) => {
                setDocument(doc.data())
            }).catch((error) => {
                toast.error("Error ocurred while getting document from database.", error)
            })
    }

    return { getDocument, document }
}