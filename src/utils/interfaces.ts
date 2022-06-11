import { User } from "firebase/auth";

export type currentUser = User | null | undefined;

export type collections = "Users" | "Companies" | "Offers";

export interface AuthContextItf {
    currentUser: currentUser;
    login: (email: string, password: string) => Promise<string | number>;
    EandPSignup: (email: string, password: string, name: string, surname: string) =>  Promise<string | number | void>
    signupGoogle: () => Promise<string | number | void>;
    signupTwitter: () =>  Promise<string | number | void>;
    logout: () => Promise<string | number>;
    loading: Boolean;
    userInfo: userInfo;
}

export type ErrorObj = { error: boolean; text: string };

export interface errorsInterface {
    [key: string]: ErrorObj;
}

type baseCompanyInfo = {name: string, uid: string}

export interface firestoreUser {
    name: string;
    surname: string;
    email: string;
    displayName: string;
    jobUid: string;
    companies: baseCompanyInfo[];
    description: string;
    hired: boolean;
    photoUrl: string;
    active: boolean;
}

export type userInfo = firestoreUser | null;