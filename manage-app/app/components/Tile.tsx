//components/tile

'use client'

import Link from "next/link";

const spanClasses: Record<TileProps["span"], string> = {
  1: "col-span-1 aspect-square",
  2: "col-span-2 aspect-[51/25]",
  3: "col-span-3 aspect-[46/15]",
  4: "col-span-4",
};

const Tile = ({ span }: TileProps) => {
  return (
    <Link href={`/`} className={`bg-foreground/20 ${spanClasses[span]} rounded-xl hover:scale-95 transition-discrete duration-500 flex items-center justify-center`}>
      Tile
    </Link>
  );
};

export default Tile;
