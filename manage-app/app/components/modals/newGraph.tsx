// components/modals/newGraph.tsx
'use client'

import { useState } from "react";
import { saveChart } from "@/utils/graph/chartStorage";
import * as XLSX from "xlsx";
import Toast from "../toast";
import { RawRow, transformForChart } from "@/lib/data/pipeline";

export default function CreateChart({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [file, setFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);

  /*const handleSubmit = () => {
    try {
      saveChart(name, chartType as any, url, xKey, yKey);
      //alert("Chart saved!");
      setShowToast(true);
    } catch (err) {
      alert((err as Error).message);
    }
  };*/

  const handleSubmit = async () => {
    try {
      if (file) {
        // Parse uploaded file immediately
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as RawRow[];

        const chartData = transformForChart(raw, xKey, yKey, name);
        saveChart(name, chartType as any, chartData, xKey, yKey);// Save parsed data directly
      } else if (url) {
        // Save URL reference (to be parsed later when loading)
        saveChart(name, chartType as any, url, xKey, yKey);// Save URL reference
      } else {
        throw new Error("Please provide either a file or a URL");
      }

      setShowToast(true);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-foreground rounded-lg flex flex-col justify-center items-center text-background w-2/3 h-2/3" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-background text-2xl mb-20">Create New Chart</h1>
        <p className="mb-2">Example URL:</p>
        <p className="mb-10">/PNRao_Universal_Personal_Budget_Tracker.xlsx</p>
        <div className="mb-10 flex flex-col items-center">
          <div className="flex flex-col space-y-2 mb-5">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Chart name" className="outline-offset-2 outline-2 outline-background rounded-md"/>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Chart URL" className="outline-offset-2 outline-2 outline-background rounded-md"/>
            <input value={xKey} onChange={e => setXKey(e.target.value)} placeholder="xKey" className="outline-offset-2 outline-2 outline-background rounded-md"/>
            <input value={yKey} onChange={e => setYKey(e.target.value)} placeholder="yKey" className="outline-offset-2 outline-2 outline-background rounded-md"/>
            <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)}/>

          </div>
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
