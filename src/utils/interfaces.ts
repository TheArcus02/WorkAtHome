import { User, UserCredential } from "firebase/auth";

export type currentUser = User | null

export interface AuthContextItf {
    currentUser: currentUser
    signupGoogle: () => Promise<UserCredential>;
    signupTwitter: () => Promise<UserCredential>;
    logout: () => Promise<void>
}