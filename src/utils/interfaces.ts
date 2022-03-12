import { User } from "firebase/auth";

export interface AuthContextItf {
    currentUser: User | null;
    signupGoogle: () => void;
}