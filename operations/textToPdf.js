import PDFDocument from "pdfkit";
import fs from "fs";
import { resolve } from "path";
import { rejects } from "assert";

export const pdfIdentifier = Date.now().toString();

export function createDocument(textarea) {
  return new Promise((resolve, rejects) => {
    const doc = new PDFDocument();

    // Pipe the PDF to a file
    const writeStream = fs.createWriteStream(`output/${pdfIdentifier}.pdf`);
    doc.pipe(writeStream);

    // Add text to the PDF
    doc.fontSize(12).text(textarea, 100, 100);

    // Finalize the PDF and end the stream
    doc.end();

    writeStream.on("finish", () => {
      resolve("PDF created successfully");
    });

    writeStream.on("error", (error) => {
      reject(`PDF creation failed: ${error.message}`);
    });
  });
}
