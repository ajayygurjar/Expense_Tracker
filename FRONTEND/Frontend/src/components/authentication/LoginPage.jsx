import axios from "../../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onForgotPassword }) => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log(loginData);
    try {
      const res = await axios.post("/login", loginData);
      localStorage.setItem("token", res.data.token);

      localStorage.setItem("isPremium", res.data.user.isPremium);
      alert(res.data.message);
      setLoginData({ email: "", password: "" });
      navigate("/expenses");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Login Page</h1>

        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <div className="flex flex-col">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={changeHandler}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={changeHandler}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
            Submit
          </button>
          <button
            type="button"
            onClick={onForgotPassword}
            className="w-full text-blue-500 hover:underline text-sm mt-2"
          >
            Forgot Password?
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
