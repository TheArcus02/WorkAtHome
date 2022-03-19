import { GoogleAuthProvider, signInWithPopup, TwitterAuthProvider, User } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { AuthContextItf } from "../utils/interfaces";


export const AuthContext = React.createContext<AuthContextItf | null>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null)

    // const login = (email, password) => {

    // }
    
    const signupGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    const signupTwitter = () => {
        const provider = new TwitterAuthProvider();
        return signInWithPopup(auth, provider);
    } 

    const logout = () => {
        return auth.signOut()
    }

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })
        return unsub
    }, [])
    
    

    const value:AuthContextItf = {
        currentUser,
        signupGoogle,
        signupTwitter,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
        
    )
}