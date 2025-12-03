// components/modals/newGraph.tsx
'use client'

import { useState } from "react";
import { saveChart } from "@/utils/graph/chartStorage";
import * as XLSX from "xlsx";
import Toast from "../toast";
import { ChartData, RawRow, transformForChart, loadChartData, getHeaders } from "@/lib/data/pipeline";

export default function CreateChart({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [xKey, setXKey] = useState("");
  const [yKeys, setYKeys] = useState<string[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [chartType, setChartType] = useState("bar");
  const [file, setFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; //file selected
    if (!f) return; // No file selected then exit
    setFile(f);// Set file state

    const data = await f.arrayBuffer();// Read file as array buffer
    const workbook = XLSX.read(data, {type: "array"});// Read workbook from file
    const sheetName = workbook.SheetNames[0];// Get first sheet name
    const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];// Parse sheet to JSON
    setHeaders(getHeaders(raw));// Extract and set headers for user selection
  }

  const handleSubmit = async () => {
    try {
      if (!file && !url) throw new Error("Please provide either a file or a URL");

      let chartData: ChartData;

      if (file) {
        // Parse uploaded file
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as RawRow[];

        // Build chartData with multiple yKeys
        chartData = transformForChart(raw, xKey, yKeys, yKeys);
      } else {
        // Save URL reference (parsed later when loading)
        chartData = await loadChartData(url, xKey, yKeys, yKeys);
      }

      // Save chart (local + Supabase)
      await saveChart(name, chartType as any, chartData, xKey, yKeys.join(","));

      setShowToast(true);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-foreground rounded-lg flex flex-col justify-center items-center text-background w-2/3 h-2/3" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-background text-2xl mb-20">Create New Chart</h1>
        <div className="mb-10 flex flex-col items-center">
          <div className="flex flex-col space-y-2 mb-5">
            <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)}/>
            <div className="flex space-x-2">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Chart name" className="outline-offset-2 outline-2 outline-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 required:border-red-500" required/>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Chart URL" className="outline-offset-2 outline-2 outline-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 required:border-red-500"/>
            </div>
            <div className="flex space-x-2">
              <input value={xKey} onChange={e => setXKey(e.target.value)} placeholder="xKey" className="outline-offset-2 outline-2 outline-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 required:border-red-500" required/>
            </div>
          </div>
          <select
            multiple
            value={yKeys}
            onChange={(e) =>
              setYKeys(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
          >
            {headers.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <select value={chartType} onChange={e => setChartType(e.target.value)} className="outline-offset-2 justify-self-center w-1/2 outline-2 outline-background rounded-md">
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>
        <div>
          <button className="bg-foreground/20 pl-1 pr-1 outline-offset-2 outline-green-400 outline-2 rounded-lg hover:bg-green-400 active:bg-green-600" onClick={handleSubmit}>Save Chart</button>
        </div>
      </div>
      {showToast && <Toast message="Chart created & saved successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );
}
