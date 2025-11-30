// components/modals/createChart/page.tsx
'use client'

import { useState } from "react";
import { saveChart } from "@/utils/graph/chartStorage";

export default function CreateChart({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [chartType, setChartType] = useState("bar");

  const handleSubmit = () => {
    try {
      saveChart(name, chartType as any);
      alert("Chart saved!");
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-foreground rounded-lg flex flex-col justify-center items-center text-background w-1/4 h-1/3" onClick={(e) => e.stopPropagation()}>
        <h1 className="text-background text-2xl mb-20">Create New Chart</h1>
        <div className="mb-10">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Chart name" className="outline-offset-2 outline-2 outline-background rounded-md ml-2"/>
          <select value={chartType} onChange={e => setChartType(e.target.value)} className="outline-offset-2 outline-2 outline-background rounded-md ml-2">
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>
        <div>
          <button className="bg-foreground/20 outline-offset-2 outline-green-400 outline-2 rounded-lg active:bg-green-400" onClick={handleSubmit}>Save Chart</button>
        </div>
      </div>
    </div>
  );
}
