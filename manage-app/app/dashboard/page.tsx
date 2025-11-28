//dashboard/page.tsx
'use client'

import Tile from "../components/Tile";
import { BarChart } from "@/lib/graph/graphs";

const dashboard = () => {
  const tileIds = ["analytics", "reports", "settings", "users"]

  return(
    <div className="mt-25 m-4 grid grid-cols-4 gap-4">
      {tileIds.map((id, index) => (
        <Tile key={id} span={2} href={`/dashboard/${id}`}>
          {id === "analytics" && <BarChart />}
        </Tile>
      ))}
    </div>
  )
}
export default dashboard;

//TileData object = {[<ID/Name>, <span>], [<ID/Name, <span>], ...}
//the span amount depends on the graph to be displayed