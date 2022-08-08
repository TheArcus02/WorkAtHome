import { useEffect, useState } from "react";
import { useGetDoc } from "../../hooks/useGetDoc";
import { firestoreEntry, firestoreJobOffer } from '../../utils/interfaces'
import { OfferDetails } from "../offer/Details/OfferDetails";

type ComponentProps = {
    entryUid: string;
    offerUid: string;
}

export const JobApplicationTableRow: React.FC<ComponentProps> = ({ entryUid, offerUid }) => {

    const [entryDetails, setEntryDetails] = useState<firestoreEntry | null>(null)
    const [offerDetails, setOfferDetails] = useState<firestoreJobOffer | null>(null)

    const { getDocument, document, docRef } = useGetDoc()
    useEffect(() => {
        getDocument("Offers", offerUid, "offerDetails")
    }, [offerUid, entryUid])

    useEffect(() => {
        if (document && docRef) {
            switch (docRef) {
                case 'offerDetails': {
                    setOfferDetails(document as firestoreJobOffer)
                    break
                }
                case 'entryDetails': {
                    setEntryDetails(document as firestoreEntry)
                    break
                }
                default: return
            }
        }

    }, [document, docRef])

    useEffect(() => {
        if(offerDetails){
            getDocument(`Offers/${offerUid}/entries`, entryUid, "entryDetails")
        }
    }, [entryUid, offerUid, offerDetails])
    

    return (
        <div>JobApplicationTableRow</div>
    )
}
