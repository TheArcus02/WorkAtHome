import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

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

export type baseCompanyInfo = {name: string, uid: string}
export type baseJobInfo = {name: string, uid: string, current:Boolean}

export type socialNames = 'facebook' | 'twitter' | 'instagram' | 'website' | 'youtube' 
export type socialsInfo = {name:socialNames, link:string}
export interface firestoreUser {
    name: string;
    surname: string;
    email: string;
    socials: socialsInfo[];
    displayName: string;
    jobs: baseJobInfo[];
    companies: baseCompanyInfo[];
    description: string;
    hired: boolean;
    photoUrl: string;
    active: boolean;
}

export type userInfo = firestoreUser | null;

export interface firestoreCompany{
    createdBy: string;
    address: string;
    description: string;
    employees: string[];
    name: string;
    photoUrl: string;
    size: number;
    websiteUrl: string;
    active: boolean;
    uid: string;
}

export type seniority = 'junior' | 'mid' | 'senior';

export interface firestoreJobOffer{
    createdBy: string;
    createdAt: Timestamp;
    description: string;
    technologies: string[];
    company: baseCompanyInfo;
    location: string;
    minSalary: number;
    maxSalary: number;
    seniority: seniority;
    title: string;
    entries: string[];
}