import { readFile, writeFile } from "node:fs/promises";
import { Field } from "./data";
import { PDFDocument } from "pdf-lib";

async function createDocument(
  templateFile: string,
  row: { fields: Field[]; secret: string },
  outFile: string,
) {
  const formPdfBytes = await readFile(templateFile);
  const pdfDoc = await PDFDocument.load(formPdfBytes);
  const form = pdfDoc.getForm();

  row.fields.forEach((field: Field) => {
    const textField = form.getTextField(field.name);
    textField.setText(field.value);
    textField.enableReadOnly();
  });
  form.flatten();

  const newPdfBytes = await pdfDoc.save();
  await writeFile(outFile, newPdfBytes);
}

export { createDocument };
