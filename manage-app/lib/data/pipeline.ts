import * as XLSX from "xlsx";

// -------------------- TYPES --------------------
export interface RawRow {
  [key: string]: any;
}

export interface ChartData {
  labels: string[];
  datasets: { label: string; data: number[] }[];
}

// -------------------- INGESTION --------------------
// Unified function: handles local file paths OR remote URLs
export async function readExcel(source: string): Promise<RawRow[]> {
  let workbook: XLSX.WorkBook;

  if (source.startsWith("http://") || source.startsWith("https://")) {
    const response = await fetch(source);
    const arrayBuffer = await response.arrayBuffer();
    workbook = XLSX.read(arrayBuffer, { type: "array" });
  } else {
    workbook = XLSX.readFile(source);
  }

  const sheetName = workbook.SheetNames[0];
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

// -------------------- VALIDATION --------------------
export function validateData<T extends RawRow>(
  data: RawRow[],
  required: (keyof T)[]
): T[] {
  const keys = Object.keys(data[0] || {});
  if (!required.every((col) => keys.includes(col as string))) {
    throw new Error("Missing required columns in Excel data");
  }
  return data as T[];
}

// -------------------- TRANSFORMATION --------------------
export function transformForChart(
  data: RawRow[],
  xKey: string,
  yKey: string,
  datasetLabel: string
): ChartData {
  return {
    labels: data.map((row) => String(row[xKey])),
    datasets: [
      {
        label: datasetLabel,
        data: data.map((row) => Number(row[yKey])),
      },
    ],
  };
}




////////////////////////////////////////////////////////////////////////////




// lib/data/pipeline.ts
//import * as XLSX from "xlsx";

export interface ChartData {
  labels: string[];
  datasets: { label: string; data: number[] }[];
}

export async function loadChartData(
  source: string,
  xKey: string,
  yKey: string,
  datasetLabel: string
): Promise<ChartData> {
  let workbook: XLSX.WorkBook;

  if (source.startsWith("http://") || source.startsWith("https://")) {
    const response = await fetch(source);
    const arrayBuffer = await response.arrayBuffer();
    workbook = XLSX.read(arrayBuffer, { type: "array" });
  } else {
    workbook = XLSX.readFile(source);
  }

  const sheetName = workbook.SheetNames[0];
  const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  return {
    labels: raw.map((row: any) => String(row[xKey])),
    datasets: [
      {
        label: datasetLabel,
        data: raw.map((row: any) => Number(row[yKey])),
      },
    ],
  };
}
