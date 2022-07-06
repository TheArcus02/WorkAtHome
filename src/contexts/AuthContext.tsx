import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, TwitterAuthProvider, updateProfile, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/firebase.config";
import { useGetDoc } from "../hooks/useGetDoc";
import { useSetDoc } from "../hooks/useSetDoc";
import { AuthContextItf, currentUser, firestoreUser, userInfo } from "../utils/interfaces";


export const AuthContext = React.createContext<AuthContextItf | null>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined)
    const [userInfo, setUserInfo] = useState<userInfo>(null)
    const [loading, setLoading] = useState(true)
    const {setDocument} = useSetDoc()
    const {document, getDocument} = useGetDoc()

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
                .then(() => toast.success("Logged in Succesfully"))
                .catch(() => toast.error("Failed to login"));
    }

    const EandPSignup = (email: string, password: string, name: string, surname: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
                .then((res) => {
                    const user = res.user;
                    updateProfile(user, {
                        displayName: name + " " + surname
                    }).then(() => addUserToDb(user, name, surname))
                    toast.success("Logged in Succesfully")
                })
                .catch(() => toast.error("Failed to login"));
        
    }
    
    const signupGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                addUserToDb(user)
                toast.success("Logged in Succesfully")
            })
            .catch(() => toast.error("Failed to login"));
    }

    const signupTwitter = () => {
        const provider = new TwitterAuthProvider();
        return signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                addUserToDb(user)
                toast.success("Logged in Succesfully")
            })
            .catch(() => toast.error("Failed to login"));
    } 

    const logout = () => {
        return auth.signOut()
        .then(() => toast.success("Logged out Succesfully"));
    }

    const addUserToDb = async (user: User, name?: string, surname?:string) => {
        const docRef = doc(db, "Users", user.uid)
        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()){
            const userData:firestoreUser = {
                displayName: user.displayName as string,
                name: name ? name : "",
                socials: [],
                surname: surname ? surname : "",
                email: user.email ? user.email : "",
                jobs: [],
                companies: [],
                description: "",
                hired: false,
                active: true,
                photoUrl: user.photoURL ? user.photoURL : ""
            }
            setDocument("Users", userData, user.uid);
        }
    }


    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })
        return unsub
    }, [])
    
    useEffect(() => {
        if(currentUser !== undefined){
            setLoading(false)
            if(currentUser !== null){
                getDocument("Users", currentUser.uid)
            }
        }
    }, [currentUser])

    useEffect(() => {
      if(document){
        setUserInfo(document as userInfo);
      }
    }, [document])
    

    const value:AuthContextItf = {
        login,
        EandPSignup,
        currentUser,
        signupGoogle,
        signupTwitter,
        logout,
        loading,
        userInfo
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
        
    )
}