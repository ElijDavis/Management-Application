// lib/data/pipeline.ts
import * as XLSX from "xlsx";

// -------------------- TYPES --------------------
export interface RawRow {
  [key: string]: any;
}

export interface ChartData {
  labels: (string | null)[];
  datasets: { label: string; data: (number | null)[] }[];
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
  yKeys: string[],
  datasetLabels?: string[]
): ChartData {
  const normalized = data.map((row) => {
    const clean: RawRow = {};
    Object.keys(row).forEach((key) => {
      clean[key.trim().toLowerCase()] = row[key];
    });
    return clean;
  });

  const xKeyNorm = xKey.trim().toLowerCase();
  const yKeysNorm = yKeys.map((y) => y.trim().toLowerCase());

  const labels = normalized.map((row) => {
    const val = row[xKeyNorm];
    //If Date.parse works -> normalize to YYY-MM-DD, else return as string
    const asStr = typeof val === "string" ? val : String(val ?? "")
    const maybe = Date.parse(asStr);
    return !isNaN(maybe) ? normalizeDateLabel(asStr) : asStr;
  });

  const datasets = yKeysNorm.map((yKeyNorm, idx) => ({
    label: datasetLabels?.[idx] ?? yKeys[idx],
    data: normalized.map((row) => {
      const val = row[yKeyNorm];
      return val != null && val !== "" && !isNaN(Number(val)) ? Number(val) : null;
  })}))

  return { labels, datasets};
}

// Normalize date labels to ISO format (YYYY-MM-DD)
function normalizeDateLabel(val: any): string {
  if (val == null) return "";
  // Accept numbers (Excel date serials) and strings
  let d: Date;
  if (typeof val === "number") {
    // Excel serial date handling could be added if needed; for now treat as timestamp days → fallback
    d = new Date(val);
  } else {
    const parsed = Date.parse(String(val));
    d = isNaN(parsed) ? new Date(String(val)) : new Date(parsed);
  }
  return isNaN(d.getTime()) ? String(val) : d.toISOString().split("T")[0];
}


// -------------------- UTILITIES --------------------
// Extract headers from workbook
export function getHeadersFromWorkbook(workbook: XLSX.WorkBook): string[] {
  const sheetName = workbook.SheetNames[0];
  const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }) as any[][];

  // First row contains headers
  const headers = raw[0] || [];
  return headers.map((h: any) => String(h).trim());
}

// Extract headers from RawRow array - recommended
export function getHeaders(rows: RawRow[]): string[] {
  if (!rows || rows.length === 0) return [];
  return Object.keys(rows[0]).map((key) => key.trim());
}



////////////////////////////////////////////////////////////////////////////






// -------------------- LOADING --------------------
// Unified function: handles both URL strings and already parsed ChartData
export async function loadChartData(
  source: string | ChartData,
  xKey: string,
  yKeys: string[],
  datasetLabels?: string[]
): Promise<ChartData> {
  // Case A: already parsed ChartData
  if (typeof source !== "string") {
    return source;
  }

  // Case B: URL string
  let workbook: XLSX.WorkBook;
  const response = await fetch(source);
  const arrayBuffer = await response.arrayBuffer();
  workbook = XLSX.read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as RawRow[];

  return transformForChart(raw, xKey, yKeys, datasetLabels);
}






/////////////////////////////////////////////////////////////////////////
//Test data with Cube.js - commented out for now

/*import cubejs, { Query } from '@cubejs-client/core';

const apiUrl = 'https://heavy-lansford.gcp-us-central1.cubecloudapp.dev/cubejs-api/v1';
const cubeToken = 'your-token-here';

const cubeApi = cubejs(cubeToken, { apiUrl });


const acquisitionsByYearQuery: Query = {
  dimensions: ['Artworks.yearAcquired'],
  measures: ['Artworks.count'],
  filters: [
      {
      member: 'Artworks.yearAcquired',
      operator: 'set'
      }
  ],
  order: {
      'Artworks.yearAcquired': 'asc'
  }
};


export async function cubeLoadChartData(
  query: Query,
  xKey: string,
  yKey: string,
  datasetLabel: string
): Promise<ChartData> {
  const resultSet = await cubeApi.load(query);

  // Cube.js returns a ResultSet, not raw JSON rows
  const raw = resultSet.tablePivot();

  return {
    labels: raw.map((row: any) => String(row[xKey])),
    datasets: [
      {
        label: datasetLabel,
        data: raw.map((row: any) => Number(row[yKey])),
      },
    ],
  };
}*/
