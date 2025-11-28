//components/tile

'use client'

import Link from "next/link";
import { ReactNode } from "react";

//These two objects don't need to be rendered every render, so limit rendering 
type TileProps = {
  chartType: "bar" | "line" | "area" | "pie" | "doughnut";
  children?: ReactNode;
  href: string;
  name: string;
};;

const spanClasses: Record<number, string> = {
  1: "col-span-1 aspect-square",
  2: "col-span-2 ",//aspect-[51/25]
  3: "col-span-3 aspect-[46/15] md:aspect-[47/15]",
  4: "col-span-4",
};

const chartSpanRules: Record<string, number> ={
  bar: 2,
  line: 3,
  area: 3,
  pie: 1,
  doughnut: 1,
}

const Tile = ({chartType, children, href, name }: TileProps) => {
  const span = chartSpanRules[chartType];
  return (
    <Link href={href} className={`relative bg-foreground/20 ${spanClasses[span]} rounded-xl hover:scale-95 transition duration-500 flex items-center justify-center`}>
      <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/10 text-2xl text-white opacity-0 hover:opacity-100 transition duration-500">{name}</div>
      {children}
    </Link>
  );
};

export default Tile;
