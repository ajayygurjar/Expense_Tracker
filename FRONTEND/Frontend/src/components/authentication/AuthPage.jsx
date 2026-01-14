import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/expenses");
    }
  }, [navigate]);

  const loginHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const forgotPasswordHandler = () => {
    setShowForgotPassword(true);
  };

  const backToLoginHandler = () => {
    setShowForgotPassword(false);
    setIsLogin(true);
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          {showForgotPassword ? (
            <ForgotPassword onBack={backToLoginHandler} />
          ) : isLogin ? (
            <LoginPage onForgotPassword={forgotPasswordHandler} />
          ) : (
            <SignupPage />
          )}
          {!showForgotPassword && (
          <p className="text-center mt-4 text-gray-700">
            {isLogin ? "Don't have an account?" : "Already have an account"}
            <span
              className="text-blue-500 cursor-pointer ml-1 hover:underline"
              onClick={loginHandler}
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPage;
