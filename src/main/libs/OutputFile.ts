import * as ExcelJS from "exceljs";
import * as Papa from "papaparse";
import * as fs from "fs-extra";
import * as path from "path";

// Let's generate CSV and XSLX files: CSV can be used for parsing, XSLX for reading :)
export async function callGenerateOutputFile(resultsByFlow: any, outputCsvFile: string) {
    const csvColumns = ["Flow API Name", "Rule Name", "Item", "Severity", "Rule description", "Rule Type", "Flow Type", "Flow Label"]
    // Build CSV Data
    const csvData = [];
    for (const flowApiName of Object.keys(resultsByFlow)) {
        const flowResults = resultsByFlow[flowApiName];
        for (const flowResult of flowResults) {
            const line = [flowApiName,
                flowResult.rule,
                flowResult.name,
                flowResult.severity,
                flowResult.ruleDescription,
                flowResult.type,
                flowResult.flowType,
                flowResult.flowName
            ];
            csvData.push(line);
        }
    }
    // Write CSV
    const csvText = Papa.unparse({
        "fields": csvColumns,
        "data": csvData
    });
    await fs.ensureDir(path.dirname(outputCsvFile));
    await fs.writeFile(outputCsvFile, csvText, "utf8");

    const result = { csvFile: outputCsvFile, xslxFile: null};
    // Generate mirror preformatted XSLX file
    try {
        const xlsDirName = path.join(path.dirname(outputCsvFile), "xls");
        const xslFileName = path.basename(outputCsvFile).replace(".csv", ".xlsx");
        const xslxFile = path.join(xlsDirName, xslFileName);
        await fs.ensureDir(xlsDirName);
        await csvToXls(outputCsvFile, xslxFile);
        result.xslxFile = xslxFile;
    } catch (e) {
        console.warn("Error while generating XSLX log file:\n" + e.message + "\n" + e.stack);
    }
    return result;
}

async function csvToXls(csvFile: string, xslxFile: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = await workbook.csv.readFile(csvFile);
    // Set filters
    worksheet.autoFilter = "A1:Z1";
    // Adjust column size (only if the file is not too big, to avoid performances issues)
    if (worksheet.rowCount < 5000) {
        worksheet.columns.forEach((column) => {
            const lengths = column.values.map((v) => v.toString().length);
            const maxLength = Math.max(...lengths.filter((v) => typeof v === "number"));
            column.width = maxLength;
        });
    }
    await workbook.xlsx.writeFile(xslxFile);
}