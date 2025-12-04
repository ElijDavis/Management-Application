'use client'

import { ChartRenderer } from "@/lib/graph/graphs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Visual() {
  const { id } = useParams();
  const [chartMeta, setChartMeta] = useState<any | null>(null);

  useEffect(() => {
    // Only runs in the browser
    const stored = localStorage.getItem("graphs");
    if (stored && typeof id === "string") {
      const graphs = JSON.parse(stored);
      setChartMeta(graphs[id]);
    }
  }, [id]);

  if (!chartMeta) return <p>Chart not found</p>;

  const { chartType, source, xKey, yKeys, options } = chartMeta;

  return (
    <div className="flex flex-col items-center justify-center p-6 m-10">
      <h1 className="text-2xl font-bold">Dashboard Tile: {id}</h1>
      <ChartRenderer
        chartType={chartType}
        source={source}
        xKey={xKey}
        yKeys={Array.isArray(yKeys) ? yKeys : [yKeys]}
        datasetLabels={Array.isArray(yKeys) ? yKeys : [yKeys]}
        options={options}
      />
    </div>
  );
}
