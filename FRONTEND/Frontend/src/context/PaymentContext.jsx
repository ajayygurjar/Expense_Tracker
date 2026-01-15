import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "../api/axios";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const { fetchUserProfile } = useAuth();
  const [cashfree, setCashfree] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    load({ mode: "sandbox" })
      .then((cf) => {
        setCashfree(cf);
        console.log("Cashfree SDK loaded successfully");
      })
      .catch((error) => {
        console.error("Failed to load Cashfree SDK:", error);
        setError("Failed to load payment system");
      });
  }, []);

  const buyPremium = async () => {
    if (!cashfree) {
      alert("Payment SDK not loaded yet. Please refresh and try again.");
      return { success: false, message: "SDK not loaded" };
    }

    setProcessing(true);
    setError(null);

    try {
      // Step 1: Create order on backend
      console.log("Creating payment order...");
      const res = await axios.post("/payment/pay");
      const { paymentSessionId, orderId } = res.data; 
      console.log("Payment Session ID:", paymentSessionId);
      console.log("Order ID:", orderId);

      if (!paymentSessionId) {
        throw new Error("Payment session ID not received from server");
      }

      // Step 2: Open Cashfree checkout
      console.log("Opening Cashfree checkout modal...");
      const result = await cashfree.checkout({
        paymentSessionId,        
        redirectTarget: "_modal" 
      });

      console.log("Checkout result:", result);

      // Step 3: Handle payment errors
      if (result.error) {
        console.error("Payment error:", result.error);
        await axios.get(`/payment/payment-status/${orderId}`);
        return { 
          success: false, 
          message: result.error.message || "Payment failed" 
        };
      }

      // Step 4: Verify payment status
      if (result.paymentDetails) {
        console.log("Verifying payment status...");
        const statusRes = await axios.get(`/payment/payment-status/${orderId}`);
        
        console.log("Payment Status:", statusRes.data.paymentStatus);

        if (statusRes.data.paymentStatus === "SUCCESS") {
          console.log("Payment successful! Updating profile...");
          await fetchUserProfile(); 
          return { 
            success: true, 
            message: "Premium activated successfully! 🎉" 
          };
        } else {
          return { 
            success: false, 
            message: "Payment verification failed. Please contact support." 
          };
        }
      }

      // Step 5: Handle unexpected cases
      return { 
        success: false, 
        message: "Payment status unclear. Please check your account." 
      };

    } catch (error) {
      console.error("Error processing payment:", error);
      const message = error.response?.data?.message || error.message || "Payment processing failed";
      setError(message);
      return { success: false, message };
    } finally {
      setProcessing(false);
    }
  };

  const value = {
    cashfree,
    processing,
    error,
    buyPremium,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within PaymentProvider");
  }
  return context;
};