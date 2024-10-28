import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFolderName = Date.now().toString();
const uploadFolderPath = path.join(__dirname, "../uploads/", uploadFolderName);


//CREATING DIRECTORY 
fs.mkdir(uploadFolderPath, { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Directory created successfully!');
  });

export function uploadImages() {
  //MULTER SET UP
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${uploadFolderName}`); // Specify upload directory
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Unique filename with timestamp
    },
  });

  // File filter to allow only images
  const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"), false);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  });
  return upload;
}
