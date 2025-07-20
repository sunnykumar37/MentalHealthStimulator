import React from "react";

const LoginForm: React.FC = () => {
  return (
    <div className="max-w-sm mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form>
        <input className="w-full mb-2 p-2 border rounded" type="text" placeholder="Username or Email" />
        <input className="w-full mb-2 p-2 border rounded" type="password" placeholder="Password" />
        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm; 