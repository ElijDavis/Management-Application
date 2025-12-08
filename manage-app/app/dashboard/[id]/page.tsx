//dashboard/[id]/page.tsx

'use client'

import { ChartRenderer } from "@/lib/graph/graphs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCharts, updateChart, ChartMeta } from "@/utils/graph/chartStorage";

export default function Visual() {
  const params = useParams();
  console.log("Params:", params);
  const chartId = Array.isArray(params.id) ? params.id[0] : params.id ?? ""; 

  const [chartMeta, setChartMeta] = useState<ChartMeta | null>(null);
  // State for scale and range
  const [scale, setScale] = useState(1); // multiplier for Y-axis
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(0);
  // Show slider state can be added later
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    getCharts()
      .then((charts) => {
        const meta = charts[chartId] || null;
        setChartMeta(meta);
        if (meta && typeof meta.source !== "string") {
          setRangeEnd(meta.source.labels.length);
        }
      })
      .catch(console.error);
  }, [chartId]);

  const handleScaleChange = async (newScale: number) => {
    setScale(newScale);
    if (chartMeta) {
      const updatedMeta = {
        ...chartMeta,
        options: { ...chartMeta.options, scale: newScale },
      };
      setChartMeta(updatedMeta);
      if (chartMeta?.id) {
        await updateChart(chartMeta.id, { options: updatedMeta.options });
      }
    }
  };

  const handleRangeChange = async (start: number, end: number) => {
    if (end < start) {
      end = start; // ✅ clamp so high never below low
    }
    setRangeStart(start);
    setRangeEnd(end);

    if (chartMeta) {
      const updatedMeta = {
        ...chartMeta,
        options: { ...chartMeta.options, visibleRange: { start, end } },
      };
      setChartMeta(updatedMeta);
      if (chartMeta?.id) {
        await updateChart(chartMeta.id, { options: updatedMeta.options });
      }
    }
  };


  if (!chartMeta || !chartMeta.id) return <p className="flex self-center justify-self-center m-50">Chart not found</p>;

  const { chartType, source, xKey, yKeys, options, name } = chartMeta;

  return (
    <div className="flex flex-col items-center justify-center p-6 m-10">
      <h1 className="text-2xl font-bold">Dashboard Tile: {name}</h1>
      <ChartRenderer chartType={chartType} source={source} xKey={xKey} yKeys={Array.isArray(yKeys) ? yKeys : [yKeys]} datasetLabels={Array.isArray(yKeys) ? yKeys : [yKeys]} options={{...options, visibleRange: { start: rangeStart, end: rangeEnd }, scale }}/>
      <div className="rounded bg-foreground/20 p-2 mb-10 hover:bg-foreground/10 active:bg-foreground/20" onClick={() => (setShowSlider(!showSlider))}>Show Slider</div>
      {/* Controls */}
      {showSlider && (
        <div className="flex flex-col items-center w-full">
          {/* scale Control */}
          <div className="flex flex-col w-1/2 mt-4 items-center bg-foreground/10 p-2 rounded-lg shadow-xl shadow-foreground/10">
            <label className="">Y-Axis Scale: {scale}x</label>
            <input className="w-1/2" type="range" min={0.5} max={3} step={0.1} value={scale} onChange={(e) => handleScaleChange(Number(e.target.value))} />
          </div>
          {/* Edit Control + Range Slider */}
          <div className="flex flex-col mt-6 items-center bg-foreground/10 pb-20 p-2 rounded-lg w-1/2 shadow-xl shadow-foreground/10">
            <label className="mb-20">Visible Range: {rangeStart} - {rangeEnd}</label>
            <div className="flex flex-row items-center justify-center space-x-4">
              <input className="rotate-90" type="range" min={0} max={typeof source !== "string" ? source.labels.length : 100} value={rangeStart} onChange={(e) => handleRangeChange(Number(e.target.value), rangeEnd)} />
              <input type="number" className="w-16 text-center" value={rangeStart} onChange={(e) => handleRangeChange(Number(e.target.value), rangeEnd)} />
              <span className="mx-2"> to </span>
              <input type="number" className="w-16 text-center" value={rangeEnd} onChange={(e) => handleRangeChange(rangeStart, Number(e.target.value))} />
              <input className="rotate-90" type="range" min={rangeStart} max={typeof source !== "string" ? source.labels.length : 100} value={rangeEnd} onChange={(e) => handleRangeChange(rangeStart, Number(e.target.value))} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
