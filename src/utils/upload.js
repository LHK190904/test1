import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 *
 * @param {File} file - The file to be uploaded.
 * @param {string} folder - The folder path where the file will be uploaded.
 * @returns {Promise<string>} - The download URL of the uploaded file.
 */
const uploadFile = async (file, folder = "") => {
  try {
    const storagePath = folder ? `${folder}/${file.name}` : file.name;
    const storageRef = ref(storage, storagePath);
    const response = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(response.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};

export default uploadFile;
