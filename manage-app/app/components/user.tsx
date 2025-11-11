import Image from "next/image";

const User = () => {
  //If user is logged in, show profile pic and extra info when clicked

  return(
    <div className="flex items-center justify-center w-15 h-15 rounded-full bg-white justify-self-end m-4">
        <Image src="/images/default-user.png" alt="Profile Picture" width={40} height={40} className="rounded-full"/>
    </div>
  )
}

export default User;