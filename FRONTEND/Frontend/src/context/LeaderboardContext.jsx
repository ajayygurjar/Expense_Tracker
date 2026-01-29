import { useState, createContext, useContext, useCallback } from "react";
import axios from "../api/axios";

const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetched, setIsFetched] = useState(false); 

  const fetchLeaderboard = useCallback(async (forceRefresh = false) => {
    if (isFetched && !forceRefresh) {
      return { success: true, cached: true };
    }

    setLoading(true);
    try {
      const res = await axios.get("/premium/leaderboard");
      setLeaderboard(res.data.leaderboard || []);
      setIsFetched(true);
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
  }, [isFetched]);

  const refreshLeaderboard = useCallback(async () => {
    return await fetchLeaderboard(true);
  }, [fetchLeaderboard]);

  const value = {
    leaderboard,
    loading,
    error,
    isFetched,
    fetchLeaderboard,
    refreshLeaderboard,
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