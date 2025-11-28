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
    <div className="w-full">
      <div className="flex justify-end mr-55">{/* Make the New button dynamic because right now it is out of place */}
        <button className="z-100 -mt-1 bg-foreground/20 p-3 hover:bg-foreground/50 active:bg-foreground rounded-xl" onClick={handleClick}>New</button> 
      </div>
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