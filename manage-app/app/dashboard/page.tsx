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
  const [toDelete, setToDelete] = useState(false);

  const handleClick = () => {
    setShowCreateChart(true);
  }

  const handleDelete = () => {
    setToDelete(!toDelete)
  }

  useEffect(() => {
    getCharts().then(setCharts).catch(console.error);
  }, []);

  return(
    <div className="w-full">
      <div className="flex justify-center mt-15 gap-2">{/* Make the New button dynamic because right now it is out of place */}
        <button className="bg-foreground/50 p-2 hover:bg-foreground/50 active:bg-foreground rounded-xl" onClick={handleClick}>New</button>
        <button className="bg-foreground/50 p-2 hover:bg-foreground/50 active:bg-foreground rounded-xl" onClick={handleDelete}>Delete</button>  
      </div>
      <div className="m-4 grid grid-cols-4 gap-4 grid-flow-dense">
        {Object.entries(charts).map(([name, {chartType}]) => (
          <Tile key={name} chartType={chartType} href={`/dashboard/${name}`} name={name.toUpperCase()}>
            {toDelete && <div className="absolute inset-0 z-20 top-5 left-5 aspect-square w-5 rounded-full hover:bg-white/30 active:bg-white/50 bg-white/10 outline-2 outline-offset-2 outline-black" />}
            {chartMap[chartType]}
          </Tile>
        ))}
      </div>
      {showCreateChart && <CreateChart onClose={() => setShowCreateChart(false)} />}
    </div>
  )
}
export default dashboard;