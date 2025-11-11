import Link from "next/link";
import { usePathname } from "next/navigation";

const Tabs = ({name}: navTabs) => {
  const pathname = usePathname();
  const isActive = pathname === `/${name.toLowerCase()}`;

  return(
    <Link className={`flex justify-center h-full w-full hover:bg-gray-200 hover:text-black mx-auto rounded-md cursor-pointer ${isActive ? "bg-red-950  font-semibold" : ""}`} href={`/${name.toLowerCase()}`}>
        <h1>{name}</h1>
    </Link>
  )
}

export default Tabs;