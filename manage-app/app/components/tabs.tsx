

const Tabs = ({name}: navTabs) => {
  return(
    <div className="flex justify-center h-full w-full hover:bg-gray-200 hover:text-black mx-auto rounded-md cursor-pointer">
      <h1>{name}</h1>
    </div>
  )
}

export default Tabs;