'use client'

import Toast from "../toast";
import { useState } from "react";
import { ChartDisplayOptions, ChartMeta, updateChart } from "@/utils/graph/chartStorage";

interface EditGraphProps {
  name: string;
  chartMeta: ChartMeta;
  onClose: () => void;
}

const EditGraph = ({ name, chartMeta, onClose }: EditGraphProps) => {
  const [xAxisTitle, setXAxisTitle] = useState(chartMeta.options?.xAxisTitle || chartMeta.xKey);
  const [yAxisTitle, setYAxisTitle] = useState(chartMeta.options?.yAxisTitle || chartMeta.yKeys.join(", "));
  const [colors, setColors] = useState<Record<string, string>>(chartMeta.options?.colors || {});
  const [rangeStart, setRangeStart] = useState(chartMeta.options?.visibleRange?.start ?? 0);
  const [rangeEnd, setRangeEnd] = useState(
    chartMeta.options?.visibleRange?.end ??
    (typeof chartMeta.source !== "string" ? chartMeta.source.labels.length : 0)
  );

  const [showLegend, setShowLegend] = useState(chartMeta.options?.showLegend ?? true);
  const [showToast, setShowToast] = useState(false);

  const handleSave = async () => {
    const updatedOptions: ChartDisplayOptions = {
      xAxisTitle,
      yAxisTitle,
      colors,
      visibleRange: { start: rangeStart, end: rangeEnd },
      showLegend,
    };
    try {
      await updateChart(name, { options: updatedOptions });
      setShowToast(true);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert("Failed to update chart: " + errorMessage);
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-foreground rounded-lg flex flex-col justify-center items-center text-background w-2/3 h-2/3"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-background text-2xl mb-10">Edit Chart - {name}</h1>

        <label>X Axis Title</label>
        <input value={xAxisTitle} onChange={e => setXAxisTitle(e.target.value)} />

        <label>Y Axis Title</label>
        <input value={yAxisTitle} onChange={e => setYAxisTitle(e.target.value)} />

        {/* ✅ Only allow color pickers for Y-axis datasets */}
        {chartMeta.yKeys.map((yk) => (
          <div key={yk} className="flex items-center gap-2 mt-2">
            <span>{yk}</span>
            <input
              type="color"
              value={colors[yk] || "#3b82f6"}
              onChange={e => setColors({ ...colors, [yk]: e.target.value })}
            />
          </div>
        ))}

        <label className="mt-4">Visible Range</label>
        <input
          type="number"
          value={rangeStart}
          onChange={e => setRangeStart(Number(e.target.value))}
        />
        <input
          type="number"
          value={rangeEnd}
          onChange={e => setRangeEnd(Number(e.target.value))}
        />

        <label className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLegend}
            onChange={e => setShowLegend(e.target.checked)}
          />
          Show Legend
        </label>

        <button
          onClick={handleSave}
          className="mt-10 bg-background text-foreground px-4 py-2 rounded-md hover:bg-background/80"
        >
          Save Changes
        </button>
      </div>
      {showToast && (
        <Toast message="Chart updated successfully!" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default EditGraph;
