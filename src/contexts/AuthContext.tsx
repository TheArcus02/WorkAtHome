import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { AuthContextItf } from "../utils/interfaces";


export const AuthContext = React.createContext<AuthContextItf | null>(null);

export function useAuth() {

}

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null)

    // const login = (email, password) => {

    // }
    
    const signupGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
    }

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })
        return unsub
    }, [])
    
    

    const value:AuthContextItf = {
        currentUser,
        signupGoogle
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
        
    )
}