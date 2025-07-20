import React from "react";

const RegisterForm: React.FC = () => {
  return (
    <div className="max-w-sm mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form>
        <input className="w-full mb-2 p-2 border rounded" type="text" placeholder="Username" />
        <input className="w-full mb-2 p-2 border rounded" type="email" placeholder="Email" />
        <input className="w-full mb-2 p-2 border rounded" type="password" placeholder="Password" />
        <button className="w-full bg-green-500 text-white p-2 rounded" type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm; 