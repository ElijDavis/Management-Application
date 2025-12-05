'use client';

import Tabs from "./tabs";

const NavIsland = () => {    
  return(
    <div className={`sticky top-10 z-50 mx-auto w-[50%] rounded-lg bg-foreground/50 shadow-md shadow-foreground/30 flex justify-between *:pt-2 *:pb-2 select-none`}>
        <Tabs name={"Dashboard"}></Tabs>
        <div className="transform scale-y-150 select-none">|</div>
        <Tabs name={"Documents"}></Tabs>
        <div className="transform scale-y-150 select-none">|</div>
        <Tabs name={"Partners"}></Tabs>
        <div className="transform scale-y-150 select-none">|</div>
        <Tabs name={"Projects"}></Tabs>
        <div className="transform scale-y-150 select-none">|</div>
        <Tabs name={"Tasks"}></Tabs>
    </div>
  )
}

export default NavIsland;