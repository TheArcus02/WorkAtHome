import { User } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'

export type currentUser = User | null | undefined

export type collections = 'Users' | 'Companies' | 'Offers'

export interface AuthContextItf {
    currentUser: currentUser
    login: (email: string, password: string) => Promise<string | number>
    EandPSignup: (email: string, password: string, name: string, surname: string) => Promise<string | number | void>
    signupGoogle: () => Promise<string | number | void>
    signupTwitter: () => Promise<string | number | void>
    logout: () => Promise<string | number>
    loading: Boolean
    userInfo: userInfo
}

export type ErrorObj = { error: boolean; text: string }

export interface errorsInterface {
    [key: string]: ErrorObj
}

export type baseCompanyInfo = { name: string; uid: string }
export interface baseJobInfo {
    title: string
    companyName: string
    companyUid: string
    current: boolean
    salary: number
    startedAt: any // Timestamp in firebase / save Date obj
    endedAt: any // Timestamp in firebase / save Date obj
}

export type socialNames = 'facebook' | 'twitter' | 'instagram' | 'website' | 'youtube' | string
export type socialsInfo = { name: socialNames; link: string }
export type jobApplication = { offerUid: string; entryUid: string }

export interface firestoreUser {
    name: string
    surname: string
    email: string
    socials: socialsInfo[]
    displayName: string
    jobs: baseJobInfo[]
    companies: baseCompanyInfo[]
    description: string
    hired: boolean
    photoUrl: string
    active: boolean
    jobApplications: jobApplication[]
    uid: string
}

export type userInfo = firestoreUser | null

export interface firestoreCompany {
    createdBy: string
    address: string
    description: string
    employees: string[]
    name: string
    photoUrl: string
    size: number
    websiteUrl: string
    active: boolean
    email: string
    uid: string
}

export type seniority = 'Junior' | 'Mid' | 'Senior'

export interface firestoreJobOffer {
    active: boolean
    createdBy: string
    createdAt: any // Timestamp in firebase / save Date obj
    description: string
    technologies: string[]
    companyName: string
    companyUid: string
    location: string
    minSalary: number
    maxSalary: number
    seniority: seniority
    title: string
    entriesCounter: number
    uid: string
}

export interface firestoreEntry {
    uid: string
    userUid: string
    name: string
    surname: string
    introduce: string
    createdAt: any // Timestamp in firebase / save Date obj
    approved: boolean
    rejected: boolean
    active: boolean
}

export type Order = 'desc' | 'asc'

export type offerForm = {
    title: string
    location: string
    companyUid: string
    seniority: seniority
    minSalary: string
    maxSalary: string
    description: string
}

// export type alert = {
//     type: 'error' | 'warning' | 'info' | 'success';
//     text: string;
// }

export interface algoliaJobOffer
    extends Pick<
        firestoreJobOffer,
        | 'companyName'
        | 'createdAt'
        | 'description'
        | 'location'
        | 'maxSalary'
        | 'minSalary'
        | 'seniority'
        | 'technologies'
        | 'title'
    > {
    [key: string]: any
    objectID: string
    path: string
    __position: number
}
