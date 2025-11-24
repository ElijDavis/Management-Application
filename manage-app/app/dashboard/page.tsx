'use client'

import Tile from "../components/Tile";

const dashboard = () => {
  return(
    <div className="m-4 w-screen grid grid-cols-4 gap-4">
      <Tile span={3}></Tile>
    </div>
  )
}
export default dashboard;