import { Unsubscribe } from "firebase/auth"
import { collection, onSnapshot, query, QueryConstraint, QuerySnapshot } from "firebase/firestore"
import { useState } from "react"
import { db } from "../firebase/firebase.config"
import { collections } from "../utils/interfaces"


export const useRealtimeCollection = () => {
    const [realtimeCollection, setRealtimeCollection] = useState<QuerySnapshot | undefined>(undefined)
    const [unsubscribe, setUnsubscribe] = useState<Unsubscribe | undefined>(undefined)

    const getRealtime = (dbCollection: collections | string, ...queryConstraints:QueryConstraint[]) => {
        const q = query(collection(db, dbCollection), ...queryConstraints)
        const unsub = onSnapshot(q, (snapshot:QuerySnapshot) => {
            setRealtimeCollection(snapshot)
        })
        setUnsubscribe(() => unsub)
    }

    return { realtimeCollection, getRealtime, unsubscribe }
}