import algoliasearch from 'algoliasearch/lite'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

type envVar = string | undefined
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY as envVar,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN as envVar,
    projectId: import.meta.env.VITE_PROJECT_ID as envVar,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET as envVar,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID as envVar,
    appId: import.meta.env.VITE_APP_ID as envVar,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = initializeFirestore(app, {
    ignoreUndefinedProperties: true,
})
export const storage = getStorage(app)
export const searchClient = algoliasearch(
    import.meta.env.VITE_ALGOLIA_APP_ID as string,
    import.meta.env.VITE_SEARCH_ONLY_API_KEY as string
)
