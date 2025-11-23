import Link from "next/link";
import { usePathname } from "next/navigation";

const Tabs = ({name}: NameProps) => {
  const pathname = usePathname();
  const isActive = pathname === `/${name.toLowerCase()}`;

  return(
    <Link className={`flex justify-center h-full w-full hover:bg-gray-200 hover:text-black mx-auto hover:rounded-md cursor-pointer ${isActive ? "bg-linear-to-r from-white/0 from-0% via-black/35 via-50% to-white/0 to-100%  font-semibold" : ""}`} href={`/${name.toLowerCase()}`}>
        <h1>{name}</h1>
    </Link>
  )
}

export default Tabs;