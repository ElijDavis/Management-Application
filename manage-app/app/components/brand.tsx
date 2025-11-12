import Link from "next/link";

const Brand = ({name}: navTabs) => {
  return(
    <div className="flex justify-center items-center flex-col ml-10 m-4">
      <h1 className="text-5xl underline"><Link href="/dashboard">{name}</Link></h1>
      <h2><Link href="/">Oscen</Link></h2>
    </div>
  )
}

export default Brand;