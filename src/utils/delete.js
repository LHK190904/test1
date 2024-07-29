import { ref, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Deletes a file from Firebase Storage.
 *
 * @param {string} filePath - The path of the file to be deleted.
 * @returns {Promise<void>}
 */
const deleteFile = async (filePath) => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file: ", error);
    throw error;
  }
};

export default deleteFile;
