// components/modals/newGraph.tsx
'use client'

import { useState, useEffect } from "react";
import { saveChart } from "@/utils/graph/chartStorage";
import * as XLSX from "xlsx";
import Toast from "../toast";
import { ChartData, RawRow, transformForChart, loadChartData, getHeaders } from "@/lib/data/pipeline";

function validateChartName(name: string): string | null {
  if (!name || !name.trim()) {
    return "Chart name cannot be blank.";
  }
  if (/^[^a-zA-Z0-9]/.test(name)) {
    return "Chart name must start with a letter or number.";
  }
  if (/['"]/.test(name)) {
    return "Chart name cannot contain quotes or apostrophes.";
  }
  return null; // valid
}


export default function CreateChart({ onClose, onChartSaved }: { onClose: () => void; onChartSaved: (chartMeta: any) => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [xKey, setXKey] = useState("");
  const [yKeys, setYKeys] = useState<string[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [chartType, setChartType] = useState("bar");
  const [file, setFile] = useState<File | null>(null);
  const [showToast, setShowToast] = useState(false);
  //options states
  const [xAxisTitle, setXAxisTitle] = useState("");
  const [yAxisTitle, setYAxisTitle] = useState("");
  //const [colors, setColors] = useState<string[]>([]); // align with yKeys length
  const [colors, setColors] = useState<Record<string, string>>({}); // keyed by header name
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const chartTypeOptions = ["bar", "line", "pie", "doughnut"];

  function isDateValue(val: any): boolean {
    if (typeof val !== "string") return false;
    const timestamp = Date.parse(val);
    return !isNaN(timestamp);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; //file selected
    if (!f) return; // No file selected then exit
    setFile(f);// Set file state

    const data = await f.arrayBuffer();// Read file as array buffer
    const workbook = XLSX.read(data, {type: "array"});// Read workbook from file
    const sheetName = workbook.SheetNames[0];// Get first sheet name
    const raw = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];// Parse sheet to JSON
    
    const allHeaders = getHeaders(raw);// Extract headers from parsed data
    
    const firstRow = raw[0];// Get first row for logging
    const validHeaders = allHeaders.filter(h => {
      const val = firstRow[h];
      return typeof val === "number" || isDateValue(val);
    });
    setHeaders(validHeaders);
    console.log("Valid headers (numeric or date):", validHeaders);

  }

  const handleSubmit = async () => {
    try {
      // Validate name
      const error = validateChartName(name);
      if (error) {
        alert(error);
        return;
      }

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
      // Build options
      const options = {
        xAxisTitle: xAxisTitle || xKey,      // default to selected key
        yAxisTitle: yAxisTitle || (yKeys.length === 1 ? yKeys[0] : "Values"),
        colors,
        visibleRange: rangeEnd == null
          ? { start: rangeStart, end: Number.MAX_SAFE_INTEGER } // show all from start
          : (rangeEnd <= 1 ? { start: rangeStart, end: -Math.abs(rangeEnd) } // negative signals fraction
                            : { start: rangeStart, end: rangeEnd }),
        showLegend
      };
      // Save chart (local + Supabase)
      await saveChart(name, chartType as any, chartData, xKey, yKeys, options);
      onChartSaved({ name, chartType, source: file ? chartData : url, xKey, yKeys, options });


      setShowToast(true);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 z-50" onClick={onClose}>
      <div className="bg-foreground rounded-lg flex flex-col justify-center items-center text-background w-2/3 h-5/6" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-background text-2xl mb-10">Create New Chart</h1>

        {/* File + Name + URL + Chart Type */}
        <div className="flex flex-row items-center justify-center w-full pl-10 pr-10">
          {/* Name and URL inputs */}
          <div className="flex flex-col space-y-2 w-1/2 mr-5">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Chart Name" className="bg-background/20 rounded-lg pl-2" />
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste URL" className="bg-background/20 rounded-lg pl-2" />
          </div>
          {/* File upload and Chart type selection */}
          <div className="flex flex-col space-y-2 w-1/2 ml-5">
            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="bg-background/20 rounded-lg pl-2" />
            <select value={chartType} onChange={e => setChartType(e.target.value)} className="bg-background/20 rounded-lg pl-2">
              {chartTypeOptions.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* X and Y key selection */}
        <div className="flex flex-col md:flex-row md:space-x-10 w-full pl-10 pr-10 pb-5 pt-5">
          {/* X key */}
          <div className="flex flex-wrap gap-2 bg-background/10 p-2 rounded-lg w-full md:w-1/2 min-h-[4rem] max-h-[12rem] overflow-y-auto">
            {headers.length > 0 ? headers.map(h => (
              <div key={h} className="flex items-center gap-2">
                <button className={`w-fit h-fit rounded-lg px-3 py-1 ${xKey === h ? "bg-blue-400" : "bg-background/20 hover:bg-background/40 active:bg-background/60"}`} onClick={() => setXKey(h)}>
                  {h}
                </button>
              </div>
            )) : <span className="text-sm text-gray-400">No items available</span>}
          </div>

          {/* Y keys */}
          <div className="flex flex-wrap gap-2 bg-background/10 p-2 rounded-lg w-full md:w-1/2 min-h-[4rem] max-h-[12rem] overflow-y-auto">
            {headers.length > 0 ? headers.map(h => {
              const selected = yKeys.includes(h);
              return (
                <div key={h} className="flex items-center gap-2">
                  <button
                    className={`w-fit h-fit rounded-lg px-3 py-1 ${
                      selected
                        ? "bg-blue-400"
                        : "bg-background/20 hover:bg-background/40 active:bg-background/60"
                    }`}
                    onClick={() => {
                      if (selected) {
                        setYKeys(yKeys.filter(key => key !== h));
                      } else {
                        setYKeys([...yKeys, h]);
                      }
                    }}
                  >
                    {h}
                  </button>
                  {selected && (
                    <input
                      type="color"
                      value={colors[h] ?? "#3b82f6"}
                      onChange={e => setColors(prev => ({ ...prev, [h]: e.target.value }))}
                    />
                  )}
                </div>
              );
            }) : <span className="text-sm text-gray-400">No items available</span>}
          </div>
        </div>

        {/* Axis titles */}
        <div className="flex flex-row space-x-10 w-full pl-10 pr-10 pb-5">
          <input type="text" value={xAxisTitle} onChange={e => setXAxisTitle(e.target.value)} placeholder="X-Axis Title (Optional)" className="w-1/2 p-2 bg-background/10 rounded-lg" />
          <input type="text" value={yAxisTitle} onChange={e => setYAxisTitle(e.target.value)} placeholder="Y-Axis Title (Optional)" className="w-1/2 p-2 bg-background/10 rounded-lg" />
        </div>

        {/* Visible range */}
        <div className="flex flex-row justify-between space-x-10 w-full pl-10 pr-10 pb-5">
          <div className="flex flex-col justify-center items-center w-full">
            <p className="">Start:</p>
            <input type="number" value={rangeStart} onChange={e => setRangeStart(Number(e.target.value))} placeholder="Visible Range Start (index)" className="w-full p-2 bg-background/10 rounded-lg" />
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <p className="">End:</p>
            <input type="number" value={rangeEnd ?? ""} onChange={e => setRangeEnd(e.target.value ? Number(e.target.value) : null)} placeholder="Visible Range End (index or -fraction)" className="w-full p-2 bg-background/10 rounded-lg" />
          </div>
        </div>

        {/* Legend toggle */}
        <label className="flex items-center gap-2 mt-5">
          <input type="checkbox" checked={showLegend} onChange={e => setShowLegend(e.target.checked)} />
          <span>Show legend</span>
        </label>

        {/* Save */}
        <button className="bg-foreground/20 mt-10 px-2 outline-2 outline-offset-2 outline-green-400 rounded-lg hover:bg-green-400 active:bg-green-600" onClick={handleSubmit}>
          Save Chart
        </button>
      </div>
      {showToast && <Toast message="Chart created & saved successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );
}
