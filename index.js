import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { uploadImages } from "./operations/downloadPdf.js";
import { directoryToImageArray } from "./operations/downloadPdf.js";
import { imagesToPdf } from "./operations/downloadPdf.js";
import { uploadFolderName } from "./operations/downloadPdf.js";

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

app.get("/about", (req, res) => {
  res.render(path.join(__dirname, "views/about.ejs"));
});

app.get("/contact", (req, res) => {
  res.render(path.join(__dirname, "views/contact.ejs"));
});


const upload = uploadImages();
app.post("/uploadPhotos", upload.array("images", 5), (req, res) => {
  try {
    res.render("downloadPdf.ejs");
  } catch (err) {
    res.status(400).send(err.message);
  }
});


app.get("/downloadPdf", async (req, res) => {
  const directoryPath = path.join(__dirname, `uploads/${uploadFolderName}`);
  const images = await directoryToImageArray(directoryPath);

  const outputFolder = path.join(
    __dirname,
    `output/YourPdf${uploadFolderName}.pdf`
  );

  await imagesToPdf(images, outputFolder);

  res.download(outputFolder, `YourPdf${uploadFolderName}.pdf`, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    } else {
      console.log("File downloaded successfully");
    }
  });
});

//PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
