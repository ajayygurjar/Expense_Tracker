import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("/premium/profile");
      const userData = res.data.user;
      setUser(userData);
      setIsPremium(userData.isPremium);
      setError(null);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      setIsPremium(false);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (credentials) => {
    try {
      const res = await axios.post("/login", credentials);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setIsPremium(res.data.user.isPremium);
      setError(null);
      navigate("/expenses");
      return { success: true, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      return {
        success: false,
        message,
      };
    }
  };

  const logout = () => {
    try {
      localStorage.clear();
      setUser(null);
      setIsPremium(false);
      setError(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const signup = async (userData) => {
    try {
      const res = await axios.post("/signup", userData);
      setError(null);
      return { success: true, message: res.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      setError(message);
      return {
        success: false,
        message,
      };
    }
  };

  const value = {
    user,
    isPremium,
    loading,
    error,
    login,
    logout,
    signup,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
