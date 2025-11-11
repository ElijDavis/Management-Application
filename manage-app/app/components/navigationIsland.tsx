import Tabs from "./tabs";

const NavIsland = () => {
  return(
    <div className="sticky top-10 z-50 mx-auto w-[50%] rounded-lg bg-white/50 shadow-md flex justify-between p-6 pt-2 pb-2">
        <Tabs name={"Dashboard"}></Tabs>
        <div className="transform scale-y-150">|</div>
        <Tabs name={"Documents"}></Tabs>
        <div>|</div>
        <Tabs name={"Partners"}></Tabs>
        <div>|</div>
        <Tabs name={"Projects"}></Tabs>
        <div>|</div>
        <Tabs name={"Tasks"}></Tabs>
    </div>
  )
}

export default NavIsland;