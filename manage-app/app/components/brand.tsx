import Link from "next/link";

const Brand = ({name}: navTabs) => {
  return(
    <h1 className="m-4 ml-10 text-5xl underline"><Link href="/dashboard">{name}</Link></h1>
  )
}

export default Brand;