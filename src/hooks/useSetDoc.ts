import { DocumentData, setDoc, doc, FirestoreError, addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"
import { db } from "../firebase/firebase.config"
import { collections } from "../utils/interfaces"

export const useSetDoc = () => {
    const [firebaseDoc, setFirebaseDoc ] = useState<DocumentData | undefined>(undefined)

    const setDocument = async ( c: collections | string, data: any, id?: string ) => {
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
      };
      
    return {setDocument, firebaseDoc};
}