//authModal.tsx
'use client';

const AuthModal = (modal: string) => {

  return(
    <div className="lex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg">
      <h1>{modal}</h1>
      <div>
        <input type="text" placeholder="Username" className="border p-2 m-2"/>
        <input type="password" placeholder="Password" className="border p-2 m-2"/>
        <button className="bg-blue-500 text-white p-2 m-2 rounded">{modal}</button>
      </div>
    </div>
  )
};

export default AuthModal;