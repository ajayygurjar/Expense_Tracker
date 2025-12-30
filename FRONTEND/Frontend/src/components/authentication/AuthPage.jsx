import { useState,useEffect } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate=useNavigate()
  const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/expenses");
    }
  }, [navigate]);

  const loginHandler = () => {
    setIsLogin((prev) => !prev);
  };
  return (
    <>
      {isLogin ? <LoginPage /> : <SignupPage />}
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account"}
        <span
          style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
          onClick={loginHandler}
        >
          {isLogin ? "Sign up" : "Login"}
        </span>
      </p>
    </>
  );
};

export default AuthPage;
