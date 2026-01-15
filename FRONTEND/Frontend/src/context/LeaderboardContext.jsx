import { useState, createContext, useContext } from "react";
import axios from "../api/axios";

const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/premium/leaderboard");
      setLeaderboard(res.data.leaderboard || []);
      setShowLeaderboard(true);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error("Error fetching leaderboard", error);
      if (error.response?.status === 403) {
        const message = "This feature is only available for premium members!";
        setError(message);
        return {
          success: false,
          message,
        };
      }
      const message = "Failed to fetch leaderboard";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const toggleLeaderboard = async () => {
    if (showLeaderboard) {
      setShowLeaderboard(false);
      return { success: true };
    } else {
      return await fetchLeaderboard();
    }
  };

  const value = {
    leaderboard,
    loading,
    showLeaderboard,
    error,
    fetchLeaderboard,
    toggleLeaderboard,
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};


export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error("useLeaderboard must be used within LeaderboardProvider");
  }
  return context;
};