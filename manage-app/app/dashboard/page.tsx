//dashboard/page.tsx
'use client'

import {useEffect, useState } from "react";
import { getCharts } from "@/utils/graph/chartStorage";
import Tile from "../components/Tile";
import { chartMap } from "@/utils/graph/chartMap";
import CreateChart from "../components/modals/newGraph";

const dashboard = () => {
  const [charts, setCharts] = useState<Record<string, any>>({});
  const [showCreateChart, setShowCreateChart] = useState(false);

  const handleClick = () => {
    setShowCreateChart(true);
  }

  useEffect(() => {
    getCharts().then(setCharts).catch(console.error);
  }, []);

  return(
    <div className="flex flex-col w-full justify-center items-center mt-5">
      <button className="bg-amber-600 mt-20 pl-4 pr-4 active:bg-amber-700 rounded-xl" onClick={handleClick}>New</button>
      <div className="mt-25 m-4 grid grid-cols-4 gap-4">
        {Object.entries(charts).map(([name, {chartType}]) => (
          <Tile key={name} chartType={chartType} href={`/dashboard/${name}`} name={name.toUpperCase()}>
            {chartMap[chartType]}
          </Tile>
        ))}
      </div>
      {showCreateChart && <CreateChart onClose={() => setShowCreateChart(false)} />}
    </div>
  )
}
export default dashboard;