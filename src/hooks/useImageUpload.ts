import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useState } from "react"
import { toast } from "react-toastify"
import { storage } from "../firebase/firebase.config"

export const useImageUpload = () => {
    const [imageUploading, setImageUploading] = useState(false)
    const [image, setImage] = useState<string | null>(null)
    
    const uploadImage = async (imageToUpload: File, path: string) => {
        setImage(null)
        setImageUploading(true)
        const imageRef = ref(storage, path)
        
        await uploadBytes(imageRef, imageToUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log('downloadURL => ', downloadURL)
                setImage(downloadURL)
                setImageUploading(false)
            })
        })
        .catch((error: any) => toast.error("error ocurred during uploading an image.", error))
    }

    const deleteImage = async (path: string) => {
        const imageRef = ref(storage, path);
        await deleteObject(imageRef)
        .catch((error) => toast.error("An errro occured during deleting image process." + error))
    }

    return {uploadImage, image, imageUploading, deleteImage}
}