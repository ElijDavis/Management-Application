//dashboard page
'use client'

import Tile from "../components/Tile";
import { BarChart } from "@/lib/graph/graphs";

const dashboard = () => {
  return(
    <div className="mt-25 m-4 grid grid-cols-4 gap-4">
      <Tile span={3}></Tile>
      <Tile span={1}></Tile>
      <Tile span={1}></Tile>
      <Tile span={2}>
        <BarChart></BarChart>
      </Tile>
      <Tile span={1}></Tile>
      <Tile span={2}></Tile>
      <Tile span={2}></Tile>
      <Tile span={1}></Tile>
      <Tile span={3}></Tile>
    </div>
  )
}
export default dashboard;