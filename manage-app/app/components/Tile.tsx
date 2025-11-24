//components/tile

'use client'

const spanClasses: Record<TileProps["span"], string> = {
  1: "col-span-1",
  2: "col-span-2",//over 5/2 (try 5/3 or 10/5)
  3: "col-span-3",
  4: "col-span-4",
};

const Tile = ({ span, shape ="square" }: TileProps) => {
    const shapeClass = shape === "square" ? "aspect-square" : ""; // or h-64 for fixed height

  return (
    <div className={`bg-foreground/20 ${spanClasses[span]} ${shapeClass} rounded-xl`}>
      Tile
    </div>
  );
};

export default Tile;
