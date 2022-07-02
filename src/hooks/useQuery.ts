import { DocumentData, getDocs, Query, query, where } from "firebase/firestore"
import { useState } from "react"
import { toast } from "react-toastify"

export const useQuery = () => {
    const [queryResult, setQueryResult] = useState<DocumentData | undefined>(undefined)
    
    const getQuery = async (query: Query) => {
        await getDocs(query).then((doc) => {
            setQueryResult(doc)
        }).catch((error) => {
            toast.error("Error ocurred while getting document from database.", error)
        })
    }
    
    return { getQuery, queryResult } 
}