//dashboard/page.tsx
'use client'

import {useEffect, useState } from "react";
import { getCharts, deleteChart } from "@/utils/graph/chartStorage";
import Tile from "../components/Tile";
import { chartMap } from "@/utils/graph/chartMap";
import CreateChart from "../components/modals/newGraph";
import Image from "next/image";

const dashboard = () => {
  const [charts, setCharts] = useState<Record<string, any>>({});
  const [showCreateChart, setShowCreateChart] = useState(false);

  const handleClick = () => {
    setShowCreateChart(true);
  };

  const handleDelete = async (name: string) => {
    try {
      await deleteChart(name);
      setCharts((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete chart:", err);
    }
  };

  const handleEdit = () => {
    alert("Edit functionality coming soon!");
  };

  useEffect(() => {
    getCharts().then(setCharts).catch(console.error);
  }, []);

  return(
    <div className="w-full">
      <div className="flex justify-end mr-36 mt-15 gap-2">{/* Make the New button dynamic because right now it is out of place */}
        <button className="bg-foreground/50 aspect-square pl-2 pr-2 text-2xl hover:bg-foreground/10 active:bg-foreground rounded-xl" onClick={handleClick}>
          <Image src="/images/Plus.svg" alt="Add New Chart" width={24} height={24} />
        </button>
      </div>
      <div className="m-4 grid grid-cols-4 gap-4 grid-flow-dense">
        {Object.entries(charts).map(([name, {chartType, url, xKey, yKey}]) => {
          const ChartComponent = chartMap[chartType];
          return (
          <Tile key={name} chartType={chartType} href={`/dashboard/${name}`} name={name.toUpperCase()} onDelete={() => handleDelete(name)} onEdit={() => handleEdit()}>
            <ChartComponent source={url} xKey={xKey} yKey={yKey} datasetLabel={name} />
          </Tile>
          )
        })}
      </div>
      {showCreateChart && <CreateChart onClose={() => setShowCreateChart(false)} />}
    </div>
  )
}
export default dashboard;