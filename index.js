import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const PORT = 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

//ROUTES
app.get("/", (req, res) => {
  res.render(path.join(__dirname, "views/home.ejs"));
});

app.get("/imagetopdf", (req, res) => {
  res.render(path.join(__dirname, "views/imagesToPdf.ejs"));
});

app.get("/pdftoimage", (req, res) => {
  res.render(path.join(__dirname, "views/pdfToImages.ejs"));
});

//MULTER SET UP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename with timestamp
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
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

app.post("/uploadPhotos", upload.array("images", 5), (req, res) => {
  try {
    res.render("downloadPdf.ejs");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
