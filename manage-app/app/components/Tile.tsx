//components/tile

'use client'

import Link from "next/link";
import { ReactNode } from "react";

//These two objects don't need to be rendered every render, so limit rendering 
type TileProps = {
  span: 1 | 2 | 3 | 4; // restrict to valid spans
  children?: ReactNode;
  href: string
};;

const spanClasses: Record<TileProps["span"], string> = {
  1: "col-span-1 aspect-square",
  2: "col-span-2 ",//aspect-[51/25]
  3: "col-span-3 aspect-[46/15]",
  4: "col-span-4",
};

const Tile = ({ span, children, href }: TileProps) => {
  return (
    <Link href={href} className={`relative bg-foreground/20 ${spanClasses[span]} rounded-xl hover:scale-95 transition duration-500 flex items-center justify-center`}>
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 text-white opacity-0 hover:opacity-100 transition duration-500">Dashboard</div>
      {children}
    </Link>
  );
};

export default Tile;
