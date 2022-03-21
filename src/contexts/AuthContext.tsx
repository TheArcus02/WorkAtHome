import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, TwitterAuthProvider, updateProfile, User } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase.config";
import { AuthContextItf } from "../utils/interfaces";


export const AuthContext = React.createContext<AuthContextItf | null>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null)

    
    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
                .then(() => toast.success("Logged in Succesfully"))
                .catch(() => toast.error("Failed to login"));
    }

    const EandPSignup = (email: string, password: string, name: string, surname: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
                .then((res) => (
                    updateProfile(res.user, {
                        displayName: name + " " + surname
                    })
                ))
                .then(() => toast.success("Logged in Succesfully"))
                .catch(() => toast.error("Failed to login"));
        
    }
    
    const signupGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
            .then(() => toast.success("Logged in Succesfully"))
            .catch(() => toast.error("Failed to login"));
    }

    const signupTwitter = () => {
        const provider = new TwitterAuthProvider();
        return signInWithPopup(auth, provider)
            .then(() => toast.success("Logged in Succesfully"))
            .catch(() => toast.error("Failed to login"));
    } 

    const logout = () => {
        return auth.signOut()
        .then(() => toast.success("Logged out Succesfully"));
    }

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
        })
        return unsub
    }, [])
    
    

    const value:AuthContextItf = {
        login,
        EandPSignup,
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