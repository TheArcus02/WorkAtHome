import { collection, DocumentData, getDocs, query, where, WhereFilterOp, Query, QueryConstraint } from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"
import { db } from "../firebase/firebase.config"
import { collections } from "../utils/interfaces"

export const useQuery = () => {
    const [queryResult, setQueryResult] = useState<DocumentData | undefined>(undefined)
    const [queryRef, setQueryRef] = useState<string | null>(null)

    const getQuery = async (queryReference: string,
                            collecion: collections,
                            ...queryConstraints: QueryConstraint[]
                            ) => {
        setQueryResult(undefined)
        setQueryRef(queryReference)
        const q = query(collection(db, collecion), ...queryConstraints)
        await getDocs(q).then((doc) => {
            setQueryResult(doc)
        }).catch((error) => {
            toast.error("Error ocurred while getting document from database.", error)
        })
    }
    
    return { getQuery, queryResult, queryRef } 
}