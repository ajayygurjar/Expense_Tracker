import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ForgotPassword from "./ForgotPassword";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); 
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    if (!loading && (localStorage.getItem("token") || user)) {
      navigate("/expenses");
    }
  }, [navigate, user, loading]);

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
  };

  const showForgotPasswordHandler = () => {
    setShowForgotPassword(true);
  };

  const backToLoginHandler = () => {
    setShowForgotPassword(false);
    setIsLogin(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {showForgotPassword ? (
          <ForgotPassword onBack={backToLoginHandler} />
        ) : isLogin ? (
          <LoginPage onForgotPassword={showForgotPasswordHandler} />
        ) : (
          <SignupPage />
        )}

        {!showForgotPassword && (
          <p className="text-center mt-4 text-gray-700">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              className="text-blue-500 cursor-pointer ml-1 hover:underline"
              onClick={toggleAuthMode}
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
