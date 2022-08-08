import { DocumentData, getDoc, doc } from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"
import { db } from "../firebase/firebase.config"
import { collections } from "../utils/interfaces"

export const useGetDoc = () => {
    const [document, setDocument] = useState<DocumentData | undefined>(undefined)
    const [docRef, setDocRef] = useState<string | null>(null)

    const getDocument = async (collection: collections | string, id: string, docRef?: string) => {

        setDocRef(null)

        await getDoc(doc(db, collection, id))
            .then((doc) => {
                setDocument(doc.data())
            }).catch((error) => {
                toast.error("Error ocurred while getting document from database.", error)
            })

        setDocRef(docRef || null)

    }

    return { getDocument, document, docRef }
}