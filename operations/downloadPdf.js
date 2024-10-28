import path, { resolve } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import PDFDocument from "pdfkit";
import { rejects } from "assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFolderName = Date.now().toString();
const uploadFolderPath = path.join(__dirname, "../uploads/", uploadFolderName);

//CREATING DIRECTORY
fs.mkdir(uploadFolderPath, { recursive: true }, (err) => {
  if (err) throw err;
  console.log("Directory created successfully!");
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

//TAKES IMAGES FROM DIRECTORY AND RETURN AN ARRAY OF ALL IMAGES
export async function directoryToImageArray(directoryPath) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"]; // Add other extensions if needed

  // Read all files in the directory
  const files = await fs.readdirSync(directoryPath);

  // Filter files to include only images
  const images = files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .map((file) => path.join(directoryPath, file)); // Create an array of full paths

  return images;
}

export async function imagesToPdf(images, outputPath) {
  return new Promise((resolve, rejects) => {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF into a writable file
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Add each image to the PDF
    images.forEach((imagePath, index) => {
      // Add a new page for each image except the first
      if (index > 0) {
        doc.addPage();
      }

      // Add the image to the PDF
      doc.image(imagePath, {
        fit: [500, 700], // Fit image to page size
        align: "center",
        valign: "center",
      });
    });
    doc.end();
    stream.on("finish", () => resolve("PDF created successfully"));
    stream.on("error", (err) => reject(err));
  });
}
