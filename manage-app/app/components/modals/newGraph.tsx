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

  const chartTypeOptions = ["bar", "line", "pie", "doughnut", "area"];

  /*useEffect(() => {
    setColors(prev => {
      const next = [...prev];
      if (yKeys.length > next.length) {
        // add defaults
        for (let i = next.length; i < yKeys.length; i++) next.push("#3b82f6");
      } else if (yKeys.length < next.length) {
        next.length = yKeys.length;
      }
      return next;
    });
  }, [yKeys]);*/

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
      <div className="bg-foreground rounded-lg flex flex-col justify-center items-center text-background w-2/3 h-2/3" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-background text-2xl mb-10">Create New Chart</h1>

        {/* File + Name + URL + Chart Type */}
        <div className="flex flex-row items-center space-x-2 mb-5">
          <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="bg-background/20 rounded-lg pl-2" />
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Chart Name" className="bg-background/20 rounded-lg pl-2" />
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste URL" className="bg-background/20 rounded-lg pl-2" />
          <select value={chartType} onChange={e => setChartType(e.target.value)} className="bg-background/20 rounded-lg pl-2">
            {chartTypeOptions.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* X and Y key selection */}
        <div className="flex flex-col md:flex-row md:space-x-10 w-full mt-5 pl-10 pr-10 pb-5 pt-5">
          {/* X key */}
          <div className="flex flex-wrap gap-2 bg-background/10 p-2 rounded-lg w-full md:w-1/2 min-h-[4rem] max-h-[12rem] overflow-y-auto">
            {headers.length > 0 ? headers.map(h => (
              <div key={h} className="flex items-center gap-2">
                <button
                  className={`w-fit h-fit rounded-lg px-3 py-1 ${xKey === h ? "bg-blue-400" : "bg-background/20 hover:bg-background/40 active:bg-background/60"}`}
                  onClick={() => setXKey(h)}
                >
                  {h}
                </button>
                {xKey === h && (
                  <input
                    type="color"
                    value={colors[h] || "#3b82f6"}
                    onChange={e => setColors({ ...colors, [h]: e.target.value })}
                  />
                )}
              </div>
            )) : <span className="text-sm text-gray-400">No items available</span>}
          </div>

          {/* Y keys */}
          <div className="flex flex-wrap gap-2 bg-background/10 p-2 rounded-lg w-full md:w-1/2 min-h-[4rem] max-h-[12rem] overflow-y-auto">
            {headers.length > 0 ? headers.map(h => (
              <div key={h} className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={yKeys.includes(h)}
                    onChange={(e) => {
                      if (e.target.checked) setYKeys([...yKeys, h]);
                      else setYKeys(yKeys.filter(key => key !== h));
                    }}
                  />
                  {h}
                </label>
                {yKeys.includes(h) && (
                  <input
                    type="color"
                    value={colors[h] || "#3b82f6"}
                    onChange={e => setColors({ ...colors, [h]: e.target.value })}
                  />
                )}
              </div>
            )) : <span className="text-sm text-gray-400">No items available</span>}
          </div>
        </div>

        {/* Axis titles */}
        <div className="flex flex-row space-x-10 w-full pl-10 pr-10 pb-5">
          <input type="text" value={xAxisTitle} onChange={e => setXAxisTitle(e.target.value)} placeholder="X-Axis Title (Optional)" className="w-1/2 p-2 bg-background/10 rounded-lg" />
          <input type="text" value={yAxisTitle} onChange={e => setYAxisTitle(e.target.value)} placeholder="Y-Axis Title (Optional)" className="w-1/2 p-2 bg-background/10 rounded-lg" />
        </div>

        {/* Legend toggle */}
        <label className="flex items-center gap-2 mt-5">
          <input type="checkbox" checked={showLegend} onChange={e => setShowLegend(e.target.checked)} />
          <span>Show legend</span>
        </label>

        {/* Save */}
        <button className="bg-foreground/20 mt-10 px-2 rounded-lg hover:bg-green-400 active:bg-green-600" onClick={handleSubmit}>
          Save Chart
        </button>
      </div>
      {showToast && <Toast message="Chart created & saved successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );


  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-foreground rounded-lg flex flex-col justify-center items-center text-background w-2/3 h-2/3" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-background text-2xl mb-10">Create New Chart</h1>
        <div className="mb-10 flex flex-col items-center">
          <div className="flex flex-col space-y-2 mb-5">
            <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload}/>
            <div className="flex space-x-2">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Chart name" className="outline-offset-2 outline-2 outline-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 required:border-red-500" required/>
              <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Chart URL" className="outline-offset-2 outline-2 outline-background rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 required:border-red-500"/>
            </div>
          </div>
          <div className="flex space-x-2 mb-5">
            {/* ✅ Dropdown for xKey */}
            {headers.length > 0 && (
              <select value={xKey} onChange={(e) => setXKey(e.target.value)} className="bg-background text-foreground">
                <option value="">Select X Axis</option>
                {headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            )}
            {/* ✅ Dropdown for yKey */}
            {headers.map(h => (
              <label key={h} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={yKeys.includes(h)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setYKeys([...yKeys, h]);
                    } else {
                      setYKeys(yKeys.filter(key => key !== h));
                    }
                  }}
                />
                {h}
              </label>
            ))}
          </div>
          <select value={chartType} onChange={e => setChartType(e.target.value)} className="outline-offset-2 justify-self-center w-1/2 outline-2 outline-background rounded-md">
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>

        {/* *------ Chart Options ------ * */}
        <div className="mb-10 flex flex-col items-start space-y-4 *:bg-background/20 *:ring-2 *:ring-background/50 *:p-2 *:rounded-lg">
          {/* Axis titles */}
          <input value={xAxisTitle} onChange={e => setXAxisTitle(e.target.value)} placeholder="X axis title (optional)" />
          <input value={yAxisTitle} onChange={e => setYAxisTitle(e.target.value)} placeholder="Y axis title (optional)" />

          {/* Colors per dataset */}
          {yKeys.map((yk, idx) => (
            <div key={yk} className="flex items-center gap-2">
              <span>{yk}</span>
              <input
                type="color"
                value={colors[idx] || "#3b82f6"}
                onChange={e => {
                  const next = [...colors];
                  next[idx] = e.target.value;
                  setColors(next);
                }}
              />
            </div>
          ))}

          {/* Visible range */}
          <div className="flex items-center gap-2">
            <input type="number" min={0} value={rangeStart} onChange={e => setRangeStart(Number(e.target.value))} placeholder="Start index" />
            <input type="number" min={0} value={rangeEnd ?? 0} onChange={e => setRangeEnd(Number(e.target.value))} placeholder="End index (exclusive)" />
            <button type="button" onClick={() => { setRangeStart(0); setRangeEnd(null); }}>Show all</button>
            <button type="button" onClick={() => { setRangeStart(0); setRangeEnd(0.5); /* signal fractional half */ }}>First half</button>
          </div>

          {/* Legend toggle */}
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showLegend} onChange={e => setShowLegend(e.target.checked)} />
            <span>Show legend</span>
          </label>
        </div>


        <div>
          <button className="bg-foreground/20 pl-1 pr-1 outline-offset-2 outline-green-400 outline-2 rounded-lg hover:bg-green-400 active:bg-green-600" onClick={handleSubmit}>Save Chart</button>
        </div>
      </div>
      {showToast && <Toast message="Chart created & saved successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-foreground rounded-lg flex flex-col justify-center items-center text-background w-2/3 h-2/3" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-background text-2xl mb-10">Create New Chart</h1>

        {/* File upload and chart type selection section */}
        <div className="rounded-lg flex flex-row items-center space-x-2 *:drop-shadow-lg *drop-shadow-black/90">
          <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="bg-background/20 rounded-lg flex flex-row items-center pl-2" />
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Chart Name" className="text-center placeholder-center bg-background/20 rounded-lg flex items-center pl-2 focus:shadow-inner shadow-background/30 outline-none"/>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste URL" className="text-center placeholder-center bg-background/20 rounded-lg flex items-center pl-2 focus:shadow-inner shadow-background/30 outline-none"/>
          <select className="bg-background/20 rounded-lg flex items-center w-3/2 pl-2 pr-2 outline-none">
            <option value="">Chart Type</option>
            {chartTypeOptions.map((type) => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* X Key, Y Keys selection section */}
        <div className="flex flex-col md:flex-row md:space-x-10 w-full mt-5 pl-10 pr-10 pb-5 pt-5">
          {/* X key selection (single) */}
          <div className="flex flex-wrap gap-2 shadow-inner shadow-background/30 bg-background/10 p-2 rounded-lg w-full md:w-1/2 min-h-[4rem] max-h-[12rem] overflow-y-auto">
            {headers.length > 0 ? 
              (headers.map(h => (
                <button key={h} className="w-fit h-fit bg-background/20 rounded-lg flex items-center justify-center px-3 py-1 hover:bg-background/40 active:bg-background/60" onClick={() => setXKey(h)}>
                  {h}
                </button>
              ))
            ) : (
              <span className="text-sm text-gray-400">No items available</span>
            )}
          </div>

          {/* Y keys selection (multiple) */}
          <div className="flex flex-wrap gap-2 shadow-inner shadow-background/30 bg-background/10 p-2 rounded-lg w-full md:w-1/2 min-h-[4rem] max-h-[12rem] overflow-y-auto">
            {headers.length > 0 ? 
              (headers.map(h => (
                <input type="checkbox" checked={yKeys.includes(h)} key={h} className="w-fit h-fit bg-background/20 rounded-lg flex items-center justify-center px-3 py-1 hover:bg-background/40 active:bg-background/60" onChange={(e) => {
                    if (e.target.checked) {
                      setYKeys([...yKeys, h]);
                    } else {
                      setYKeys(yKeys.filter(key => key !== h));
                    }
                }}>
                  {h}
                </input>
              ))
            ) : (
              <span className="text-sm text-gray-400">No items available</span>
            )}
          </div>
        </div>
        {/* Optional Title X-Axis Y-Axis title */}
        <div className="flex flex-row space-x-10 w-full pl-10 pr-10 pb-5 *:w-1/2 *:p-2 *:bg-background/10 *:rounded-lg *:shadow-inner *:shadow-background/30 *:outline-none">
          <input type="text" value="" placeholder="X-Axis Title (Optional)" className=""></input>
          <input type="text" value="" placeholder="Y-Axis Title (Optional)" className=""></input>
        </div>
        {/* Legend toggle */}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showLegend} onChange={e => setShowLegend(e.target.checked)} />
          <span>Show legend</span>
        </label>
        <button className="bg-foreground/20 mt-10 pl-1 pr-1 outline-offset-2 outline-green-400 outline-2 rounded-lg hover:bg-green-400 active:bg-green-600" onClick={handleSubmit}>Save Chart</button>
      </div>
      {showToast && <Toast message="Chart created & saved successfully!" onClose={() => setShowToast(false)} />}
    </div>
  );
}
