//components/tile

'use client'

import { useState, useEffect } from 'react';

const Tile = ({span}: Span) => {
  return(
    <div className={`bg-background/20 col-span-${span}`}>
        Tile 1
    </div>
  )
}

export default Tile;