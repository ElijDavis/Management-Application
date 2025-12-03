// app/dashboard/[id]/page.tsx
'use client'

import { useParams } from "next/navigation";
import { chartMap } from "@/utils/graph/chartMap";

export default function Visual() {
  const { id } = useParams();
  const graphs = JSON.parse(localStorage.getItem("graphs") || "{}");
  const chartMeta = typeof id === "string" ? graphs[id]?.chartType : undefined;

  if (!chartMeta) return <p>Chart not found</p>;

  const { chartType, url } = chartMeta;
  const ChartComponent = chartMap[chartType];

  return (
    <div className="flex flex-col items-center justify-center p-6 m-10">
      <h1 className="text-2xl font-bold">Dashboard Tile: {id}</h1>
      <ChartComponent source={url} xKey="year" yKey="count" datasetLabel={id} />
    </div>
  );
}
