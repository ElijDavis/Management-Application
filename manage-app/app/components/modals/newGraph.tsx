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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/10 bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-foreground text-background h-1/3" onClick={(e) => e.stopPropagation()}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Chart name"/>
        <select value={chartType} onChange={e => setChartType(e.target.value)}>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
        <button onClick={handleSubmit}>Save Chart</button>
      </div>
    </div>
  );
}
