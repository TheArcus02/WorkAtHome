import { DocumentData, setDoc, doc, FirestoreError, addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"
import { db } from "../firebase/firebase.config"
import { collections } from "../utils/interfaces"

export const useSetDoc = () => {
    const [firebaseDoc, setFirebaseDoc ] = useState<DocumentData | undefined>(undefined)
    const [docRef, setDocRef] = useState<string | null>(null)

    const setDocument = async ( c: collections | string, data: any, id?: string, docRef?: string ) => {
        
        setDocRef(null)

        id ? await setDoc(doc(db, c, id), data, { merge: true })
          .catch(
            (err: FirestoreError) => {
              toast.error(`${err.message}`);
            }
          ) : await addDoc(collection(db, c), data).then(docRef => {
            setFirebaseDoc(docRef)
          })
          .catch(
            (err: FirestoreError) => {
              toast.error(`${err.message}`);
            }
          ) 

        setDocRef(docRef || null)

      };
      
      
    return {setDocument, firebaseDoc, docRef};
}