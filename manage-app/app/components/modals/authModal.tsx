//authModal.tsx
'use client';

const AuthModal = () => {

  const activeUser = true; //replace with actual auth check

  if(!activeUser){
    return(
      <div className="">
        <h1>Auth Modal</h1>
        <div>
          <input type="text" placeholder="Username" className="border p-2 m-2"/>
          <input type="password" placeholder="Password" className="border p-2 m-2"/>
          <button className="bg-blue-500 text-white p-2 m-2 rounded">Log In</button>
        </div>
      </div>
    )
  } else if(!activeUser){
    return(
      <div className="">
        <h1>Auth Modal</h1>
        <div>
          <input type="text" placeholder="Username" className="border p-2 m-2"/>
          <input type="password" placeholder="Password" className="border p-2 m-2"/>
          <button className="bg-blue-500 text-white p-2 m-2 rounded">Sign UP</button>
        </div>
      </div>
    )
  }

};

export default AuthModal;