import axios from '../../api/axios'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
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
      const res = await axios.post('/login',loginData);
      localStorage.setItem("token",res.data.token)
      alert(res.data.message);
      setLoginData({ email: "", password: "" });
      navigate('/expenses')
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <h1>Login Page</h1>

      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={loginData.email}
          onChange={changeHandler}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={loginData.password}
          onChange={changeHandler}
          required
        />
        <button>Submit</button>
      </form>
    </>
  );
};

export default LoginPage;
