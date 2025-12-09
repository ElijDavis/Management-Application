import Link from "next/link";

const Brand = ({name}: NameProps) => {
  return(
    <div className="flex justify-center items-center flex-col ml-10 m-4 select-none">
      <h1 className="text-4xl underline"><Link href="/dashboard">{name}</Link></h1>
      <h2><Link href="/">Oscen</Link></h2>
    </div>
  )
}

export default Brand;