import Excel from "exceljs";

type FieldMap = {
  fieldName: string;
  column: number;
};

type Field = {
  name: string;
  value: string;
};

function extractCellValue(row: Excel.Row, column: number) {
  const cellValue = row.getCell(column).value;
  return cellValue ? cellValue.valueOf().toString() : null;
}

async function extractData(
  path: string,
  fieldMaps: FieldMap[],
  secretMap: FieldMap,
) {
  const workbookReader = new Excel.stream.xlsx.WorkbookReader(path, {});

  const rows = [];
  for await (const worksheetReader of workbookReader) {
    for await (const row of worksheetReader) {
      if (row.number > 1) {
        // extract fields
        const rowFields: Field[] = [];
        fieldMaps.forEach((fieldMap) => {
          const cellValue = extractCellValue(row, fieldMap.column);
          if (cellValue !== null) {
            rowFields.push({
              name: fieldMap.fieldName,
              value: cellValue,
            });
          }
        });
        // extract secret
        const secretValue = extractCellValue(row, secretMap.column);

        if (secretValue && rowFields.length === fieldMaps.length) {
          rows.push({ fields: rowFields, secret: secretValue });
        }
      }
    }
  }
  return rows;
}

export { extractData, Field, FieldMap };
