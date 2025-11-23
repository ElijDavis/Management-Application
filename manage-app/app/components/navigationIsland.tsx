'use client';

import Tabs from "./tabs";
import {useState} from "react";
import { usePathname } from "next/navigation";

const NavIsland = () => {
    const pathname = usePathname();

    const gradients = {
      tab1: "bg-[linear-gradient(to_right,white_2%,rgba(255,255,255,0.5)_10%,white_18%)]",
      tab2: "bg-[linear-gradient(to_right,white_22%,rgba(255,255,255,0.5)_30%,white_38%)]",
      tab3: "bg-[linear-gradient(to_right,white_42%,rgba(255,255,255,0.5)_50%,white_58%)]",
      tab4: "bg-[linear-gradient(to_right,white_62%,rgba(255,255,255,0.5)_70%,white_78%)]",
      tab5: "bg-[linear-gradient(to_right,white_82%,rgba(255,255,255,0.5)_90%,white_98%)]",
    };

  return(
    <div className={`sticky top-10 z-50 mx-auto w-[50%] rounded-lg ${gradients.tab1} shadow-md flex justify-between *:pt-2 *:pb-2 `}> {/*bg-linear-to-r from-white/70 from-2% via-white/50 via-10% to-white/70 to-18% */}
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