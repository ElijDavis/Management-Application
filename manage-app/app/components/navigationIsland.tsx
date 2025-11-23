'use client';

import Tabs from "./tabs";
import {useState} from "react";
import { usePathname } from "next/navigation";

const NavIsland = () => {
    const pathname = usePathname();

  return(
    <div className={`sticky top-10 z-50 mx-auto w-[50%] rounded-lg bg-linear-to-r from-white/50 from-2% via-white/70 via-100% to-white/50 to-18% shadow-md flex justify-between *:pt-2 *:pb-2 `}>
        <Tabs name={"Dashboard"}></Tabs>
        <div className="transform scale-y-150">|</div>
        <Tabs name={"Documents"}></Tabs>
        <div className="transform scale-y-150">|</div>
        <Tabs name={"Partners"}></Tabs>
        <div className="transform scale-y-150">|</div>
        <Tabs name={"Projects"}></Tabs>
        <div className="transform scale-y-150">|</div>
        <Tabs name={"Tasks"}></Tabs>
    </div>
  )
}

export default NavIsland;