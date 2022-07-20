import { Unsubscribe } from "firebase/auth"
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore"
import { useState } from "react"
import { db } from "../firebase/firebase.config"
import { collections } from "../utils/interfaces"


export const useRealtimeCollection = () => {
    const [realtimeCollection, setRealtimeCollection] = useState<QuerySnapshot | undefined>(undefined)
    const [unsubscribe, setUnsubscribe] = useState<Unsubscribe | undefined>(undefined)

    const getRealtime = (collecion: collections | string) => {
        const unsub = onSnapshot(collection(db, collecion), (snapshot) => {
            setRealtimeCollection(snapshot)
        })
        setUnsubscribe(() => unsub)
    }

    return { realtimeCollection, getRealtime, unsubscribe }
}