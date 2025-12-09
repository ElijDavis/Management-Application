// dashboard/[id]/page.tsx

'use client'

import { ChartRenderer } from "@/lib/graph/graphs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { refreshCharts, updateChart, ChartMeta } from "@/utils/graph/chartStorage";

export default function Visual() {
  const params = useParams();
  const chartId = Array.isArray(params.id) ? params.id[0] : params.id ?? "";

  const [chartMeta, setChartMeta] = useState<ChartMeta | null>(null);
  const [scale, setScale] = useState(1);
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(0);
  const [step, setStep] = useState(10);
  const [showSlider, setShowSlider] = useState(false);

  // Always fetch fresh chart data from Supabase/localStorage
  useEffect(() => {
    const load = async () => {
      try {
        const charts = await refreshCharts(); // ✅ always pulls from Supabase
        const meta = charts[chartId] || null;
        setChartMeta(meta);

        if (meta?.options?.visibleRange) {
          setRangeStart(meta.options.visibleRange.start);
          setRangeEnd(meta.options.visibleRange.end);
        } else if (meta && typeof meta.source !== "string") {
          setRangeEnd(meta.source.labels.length);
        }

        if (meta?.options?.scale !== undefined) {
          setScale(meta.options.scale);
        }
      } catch (err) {
        console.error("Failed to load chart:", err);
      }
    };
    if (chartId) load();
  }, [chartId]);

  const handleScaleChange = async (newScale: number) => {
    setScale(newScale);
    if (!chartMeta?.id) return; // ✅ guard against undefined
    const updatedMeta = {
      ...chartMeta,
      options: { ...chartMeta.options, scale: newScale },
    };
    setChartMeta(updatedMeta);
    try {
      await updateChart(chartMeta.id, { options: updatedMeta.options });
    } catch (err) {
      console.error("Failed to update scale:", err);
    }
  };

  const handleRangeChange = async (start: number, end: number) => {
    if (end < start) end = start; // ✅ clamp
    setRangeStart(start);
    setRangeEnd(end);
    if (!chartMeta?.id) return;
    const updatedMeta = {
      ...chartMeta,
      options: { ...chartMeta.options, visibleRange: { start, end } },
    };
    setChartMeta(updatedMeta);
    try {
      await updateChart(chartMeta.id, { options: updatedMeta.options });
    } catch (err) {
      console.error("Failed to update range:", err);
    }
  };

  if (!chartMeta?.id) {
    return <p className="flex self-center justify-self-center m-50">Chart not found</p>;
  }

  const { chartType, source, xKey, yKeys, options, name } = chartMeta;

  return (
    <div className="flex flex-col items-center justify-center p-6 m-10">
      <ChartRenderer
        chartType={chartType}
        source={source}
        xKey={xKey}
        yKeys={Array.isArray(yKeys) ? yKeys : [yKeys]}
        datasetLabels={Array.isArray(yKeys) ? yKeys : [yKeys]}
        options={{
          ...options,
          visibleRange: { start: rangeStart, end: rangeEnd },
          scale,
        }}
      />
      <h1 className="text-3xl font-bold mb-10">{name}</h1>

      <div
        className="rounded bg-foreground/20 p-2 mb-10 hover:bg-foreground/10 active:bg-foreground/20 cursor-pointer"
        onClick={() => setShowSlider(!showSlider)}
      >
        {showSlider ? "Hide Controls" : "Show Controls"}
      </div>

      {showSlider && (
        <div className="flex flex-col items-center w-full">
          {/* Scale Control */}
          <div className="flex flex-col w-1/2 mt-4 items-center bg-foreground/10 p-2 rounded-lg shadow-xl shadow-foreground/10">
            <label>Y-Axis Scale: {scale}x</label>
            <input
              className="w-1/2"
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={scale}
              onChange={(e) => handleScaleChange(Number(e.target.value))}
            />
          </div>

          {/* Range Control */}
          <div className="flex flex-col mt-6 items-center bg-foreground/10 pb-20 p-2 rounded-lg w-1/2 shadow-xl shadow-foreground/10">
            <div className="flex flex-col mb-20 items-center">
              <label>Visible Range: {rangeStart} - {rangeEnd}</label>
              <div>
                <label>Step:</label>
                <input
                  type="number"
                  className="w-16 text-center"
                  value={step}
                  min={1}
                  max={rangeEnd - rangeStart}
                  onChange={(e) => setStep(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-center space-x-4">
              <input
                className="rotate-90"
                type="range"
                min={0}
                max={typeof source !== "string" ? source.labels.length : 100}
                value={rangeStart}
                step={step}
                onChange={(e) => handleRangeChange(Number(e.target.value), rangeEnd)}
              />
              <input
                type="number"
                className="w-16 text-center"
                step={step}
                value={rangeStart}
                onChange={(e) => handleRangeChange(Number(e.target.value), rangeEnd)}
              />
              <span className="mx-2"> to </span>
              <input
                type="number"
                className="w-16 text-center"
                value={rangeEnd}
                onChange={(e) => handleRangeChange(rangeStart, Number(e.target.value))}
              />
              <input
                className="rotate-90"
                type="range"
                step={step}
                min={rangeStart}
                max={typeof source !== "string" ? source.labels.length : 100}
                value={rangeEnd}
                onChange={(e) => handleRangeChange(rangeStart, Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
