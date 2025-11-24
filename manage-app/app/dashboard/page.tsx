'use client'

import Tile from "../components/Tile";

const dashboard = () => {
  return(
    <div className="mt-25 m-4 grid grid-cols-4 gap-4">
      <Tile span={3}></Tile>
      <Tile span={1}></Tile>
      <Tile span={1}></Tile>
      <Tile span={2}></Tile>
      <Tile span={1}></Tile>
      <Tile span={2}></Tile>
      <Tile span={2}></Tile>
      <Tile span={1}></Tile>
      <Tile span={3}></Tile>
    </div>
  )
}
export default dashboard;