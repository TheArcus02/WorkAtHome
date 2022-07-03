import { DocumentData, setDoc, doc, FirestoreError } from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"
import { db } from "../firebase/firebase.config"
import { collections } from "../utils/interfaces"

export const useSetDoc = () => {
    const [document] = useState<DocumentData | undefined>(undefined)

    const setDocument = async ( c: collections, id: string, data: any ) => {
        await setDoc(doc(db, c, id), data, { merge: true }).catch(
          (err: FirestoreError) => {
            toast.error(`${err.message}`);
          }
        );
      };

    return {setDocument, document};
}