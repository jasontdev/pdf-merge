import { extractData } from "./data";
import { createDocument } from "./pdf";

async function main() {
  const inputDir = "input";
  const inputFile = "input.xlsx";
  const pdfTemplate = "test_template.pdf";

  const fieldMaps = [
    { fieldName: "Username", column: 1 },
    { fieldName: "Password", column: 2 },
  ];

  const secretMap = {
    fieldName: "Current Password",
    column: 4,
  };

  const rows = await extractData(
    `${inputDir}/${inputFile}`,
    fieldMaps,
    secretMap,
  );
  rows.map(async (row) => {
    await createDocument(pdfTemplate, row, `${row.fields[0].value}.pdf`);
  });
  console.log(rows);
}

main().catch((e) => console.log(e));
