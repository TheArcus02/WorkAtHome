import { faker } from '@faker-js/faker'
import { addDoc, collection, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase.config'
import { collections, firestoreCompany, firestoreJobOffer, seniority } from './interfaces'

type Tcompanies = {
    [key: string]: {
        name: string
        ownerUid: string
    }
}

const companies: Tcompanies = {
    // '3TIniKUW5xFBQzDXKxL1': {
    //     name: 'Adidas',
    //     ownerUid: 'tenUdRfNaah68EvZCbR4gdzhvsJ3'
    // }
    // ,
    // '8nVWAZky12185QdBhpF6':{
    //     name: 'Microsoft',
    //     ownerUid: '0L5VEebXMobyluomTjMwS5HFC9A3'
    // },
    // '9jutISu3tsQf8Xd4my0N':{
    //     name: 'Adobe',
    //     ownerUid: '0L5VEebXMobyluomTjMwS5HFC9A3'
    // },
    // 'VuD1EnSGuPNtaLLCZz9L':{
    //    name: 'Nike',
    //    ownerUid: 'tenUdRfNaah68EvZCbR4gdzhvsJ3'
    // } ,
    // 'kK31f6eQONEcK8KRC5bB':{
    //     name: 'Jordan',
    //     ownerUid: 'tenUdRfNaah68EvZCbR4gdzhvsJ3'
    // },
    // 'oCTmLrpKJjCcY0uCHwo1':{
    //     name: 'Reebok',
    //     ownerUid: 'tenUdRfNaah68EvZCbR4gdzhvsJ3'
    // }
    // test account companies 🔽
    XlBnzPe0b789mJl8MO3X: {
        name: 'Luettgen - Rogahn',
        ownerUid: '5WMWWaJb78cOMfj3YrzcjllGzug2',
    },
    cDDPRlScKtJhfPneCo9A: {
        name: 'Jenkins, Conroy and Roberts',
        ownerUid: '5WMWWaJb78cOMfj3YrzcjllGzug2',
    },
    MuIC8FIoXspgJ1kHeN4o: {
        name: 'Armstrong Group',
        ownerUid: '5WMWWaJb78cOMfj3YrzcjllGzug2',
    },
}

export const fakeJobOffer = () => {
    const seniorities: seniority[] = ['Junior', 'Mid', 'Senior']
    const techOptions = {
        'React Developer': ['React', 'Redux', 'Javascript', 'Typescript'],
        'Node.js Developer': ['Node.js', 'Javascript', 'AWS'],
        'React Native Engineer': ['React Native', 'Javascript', 'Typescript', 'Apollo'],
        'Python Django Developer': ['Python', 'Django', 'Docker', 'SQL'],
        'Java Engineer': ['Java', 'OOP', 'Spring', 'Jenkins'],
        'PHP developer': ['PHP', 'MySQL', 'Docker', 'RESTful API'],
    }

    const companyUid = faker.helpers.objectKey(companies) as string
    const companyName = companies[companyUid].name
    const companyOwner = companies[companyUid].ownerUid

    const location = faker.address.country() + ', ' + faker.address.cityName() + ', ' + faker.address.streetAddress()
    const maxSalary = Math.ceil(parseInt(faker.finance.amount(5000, 20000, 0)) / 100) * 100
    const minSalary = Math.ceil(parseInt(faker.finance.amount(5000, maxSalary)) / 100) * 100
    const seniority = faker.helpers.arrayElement(seniorities)
    const randomTechOptionTitle = faker.helpers.objectKey(techOptions)
    const technologies = techOptions[randomTechOptionTitle]

    const title = seniority + ' ' + randomTechOptionTitle

    const offerObj: firestoreJobOffer = {
        active: true,
        companyName,
        companyUid,
        createdAt: new Date(),
        createdBy: companyOwner,
        description: faker.lorem.paragraphs(5),
        entriesCounter: 0,
        location,
        minSalary,
        maxSalary,
        seniority,
        technologies,
        title,
        uid: '',
    }
    return offerObj
}

export const fakeCompany = (userId: string) => {
    const address = faker.address.country() + ', ' + faker.address.cityName() + ', ' + faker.address.streetAddress()
    const name = faker.company.name()

    const companyObj: firestoreCompany = {
        active: true,
        name,
        address,
        description: faker.lorem.paragraphs(5),
        email: faker.internet.email(name),
        size: 0,
        websiteUrl: faker.internet.url(),
        employees: [],
        photoUrl:
            'https://firebasestorage.googleapis.com/v0/b/workathome-1389e.appspot.com/o/placeholders%2Fcompany_placeholder.jpg?alt=media&token=542aa3b0-4e6a-4b84-9813-f62364e0a12e',
        uid: '',
        createdBy: userId,
    }

    return companyObj
}

export const saveToDatabase = async (data: Array<any>, c: collections | string) => {
    data.forEach((data) =>
        addDoc(collection(db, c), data).then((doc) => {
            updateDoc(doc, { uid: doc.id })
            console.log(doc.id)
        })
    )
}
