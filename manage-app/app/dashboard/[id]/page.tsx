// app/dashboard/[id]/page.tsx
'use client'

import { useParams } from "next/navigation";
import { chartMap } from "@/utils/graph/chartMap";

export default function Visual() {
  const { id } = useParams();
  const graphs = JSON.parse(localStorage.getItem("graphs") || "{}");
  const chartType = typeof id === "string" ? graphs[id]?.chartType : undefined;

  if (!chartType) return <p>Chart not found</p>;

  return (
    <div className="flex flex-col items-center justify-center p-6 m-10">
      <h1 className="text-2xl font-bold">Dashboard Tile: {id}</h1>
      {chartMap[chartType]}
    </div>
  );
}
