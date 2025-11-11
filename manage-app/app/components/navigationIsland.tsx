'use client';

import Tabs from "./tabs";
import {useState} from "react";

const NavIsland = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    }

  return(
    <div className="sticky top-10 z-50 mx-auto w-[50%] rounded-lg bg-white/50 shadow-md flex justify-between *:pt-2 *:pb-2">
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