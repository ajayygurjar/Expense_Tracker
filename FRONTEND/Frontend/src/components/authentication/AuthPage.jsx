import { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

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
