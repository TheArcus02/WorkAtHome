import { User, UserCredential } from "firebase/auth";

export type currentUser = User | null

export interface AuthContextItf {
    currentUser: currentUser;
    EandPSignup: (email: string, password: string, name: string, surname: string) => Promise<string | number>;
    signupGoogle: () => Promise<string | number>;
    signupTwitter: () => Promise<string | number>;
    logout: () => Promise<string | number>;
}

export type ErrorObj = { error: boolean; text: string };

export interface errorsInterface {
    [key: string]: ErrorObj;
}