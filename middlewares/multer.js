import multer from "multer";
const storage = multer.memoryStorage()
// but you can use also key pair same storage

export const singleUpload = multer({ storage }).single("file")



