//dashboard/[id]/page.tsx

'use client'

import { ChartRenderer } from "@/lib/graph/graphs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCharts, ChartMeta } from "@/utils/graph/chartStorage";
import EditGraph from "@/app/components/modals/editGraph";

export default function Visual() {
  const params = useParams();
  const chartId = Array.isArray(params.id) ? params.id[0] : params.id ?? ""; // ✅ always a string

  const [chartMeta, setChartMeta] = useState<ChartMeta | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    getCharts()
      .then((charts) => {
        setChartMeta(charts[chartId] || null);
      })
      .catch(console.error);
  }, [chartId]);

  if (!chartMeta) return <p>Chart not found</p>;

  const { chartType, source, xKey, yKeys, options, name } = chartMeta;

  return (
    <div className="flex flex-col items-center justify-center p-6 m-10">
      <h1 className="text-2xl font-bold">Dashboard Tile: {name}</h1>

      <div className="flex gap-4 mb-4">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => setShowEdit(true)}
        >
          Edit
        </button>
      </div>

      <ChartRenderer
        chartType={chartType}
        source={source}
        xKey={xKey}
        yKeys={Array.isArray(yKeys) ? yKeys : [yKeys]}
        datasetLabels={Array.isArray(yKeys) ? yKeys : [yKeys]}
        options={options}
      />

      {showEdit && (
        <EditGraph
          name={chartMeta.name}
          chartMeta={chartMeta}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
