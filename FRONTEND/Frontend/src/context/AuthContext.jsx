import { useEffect, createContext, useState,useContext } from "react";
import axios from "../api/axios";
import { load } from "@cashfreepayments/cashfree-js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cashfree, setCashfree] = useState(null);

  useEffect(() => {
    load({ mode: "sandbox" }).then((cf) => setCashfree(cf));
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/premium/profile");
      const userData = res.data.user;
      setUser(userData);
      setIsPremium(userData.isPremium);
      localStorage.setItem("isPremium", userData.isPremium);
    } catch (error) {
      console.log("Error fetching user Profile", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post("/login", credentials);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isPremium", res.data.user.isPremium);
      setUser(res.data.user);
      setIsPremium(res.data.user.isPremium);
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login Failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isPremium");
    setUser(null);
    setIsPremium(false);
    navigate("/");
  };
  const buyPremium = async () => {
    if (!cashfree) {
      alert("Payment SDK not loaded yet");
    }
    try {
      const res = await axios.post("/payment/pay");
      const { paymentSessionId, orderId } = res.data;
      cashfree
        .checkout({
          paymentSessionId,
          redirectTarget: "_modal",
        })
        .then(async (result) => {
          if (result.error) {
            alert("Trasaction failer");
            console.log(result.error);
            await axios.get(`/payment/payment-status/${orderId}`);
          }
          if (result.paymentDetails) {
            const statusRes = await axios.post(
              `/payment/payment-status${orderId}`
            );

            if (statusRes.data.paymentStatus === "SUCCESS") {
              alert("Transaction Successful! You are now a Premium User.");
              await fetchUserProfile();
            } else {
              alert("Transaction Failed!");
            }
          }
        });
    } catch (error) {
        console.error("Error in premium purchase:", error);
      alert("Failed to initiate payment");
    }
  };
  const value = {
    user,
    isPremium,
    loading,
    login,
    logout,
    buyPremium,
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
}