import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useCallback, useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

import Header from "../layout/Header";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Leaderboard from "../premium/LeaderBoard";
import PremiumBanner from "../premium/PremiumBanner";

const ExpensePage = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);

  //CashFree States
  const [cashfree, setCashfree] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  const [loading, setLoading] = useState(true);

  //leader board
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/premium/profile");

      const premiumStatus = res.data.user.isPremium;

      setIsPremium(premiumStatus);

      localStorage.setItem("isPremium", premiumStatus);
    } catch (error) {
      console.error("Error fetching user profile", error);
    } finally {
      setLoading(false);
    }
  };

  //fetch expenses
  const fetchExpenses =useCallback( async () => {
    try {
      const res = await axios.get("/expenses");
      setExpenses(res.data.expenses);
    } catch (error) {
      console.error("error fetching expenses", error);
      alert("Unauthorized");
      navigate("/");
    }
  }, [navigate]);

  const fetchLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await axios.get("/premium/leaderboard");

      setLeaderboard(res.data.leaderboard);
      setShowLeaderboard(true);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      if (error.response?.status === 403) {
        alert("This feature is only available for premium members!");
      } else {
        alert("Failed to fetch leaderboard");
      }
    } finally {
      setLoadingLeaderboard(false);
    }
  }, []);

  const toggleLeaderboard = () => {
    if (showLeaderboard) {
      setShowLeaderboard(false);
    } else {
      fetchLeaderboard();
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchUserProfile();
    fetchExpenses();

    load({ mode: "sandbox" }).then((cf) => setCashfree(cf));
  }, [fetchExpenses,navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    
    <PremiumBanner isPremium={isPremium} />
     <Header
      isPremium={isPremium}
      cashfree={cashfree}
      fetchUserProfile={fetchUserProfile}
      toggleLeaderboard={toggleLeaderboard}
      showLeaderboard={showLeaderboard}
      loadingLeaderboard={loadingLeaderboard}
      navigate={navigate}
    />
    <ExpenseForm fetchExpenses={fetchExpenses} />
    <hr />
        <Leaderboard
      isPremium={isPremium}
      showLeaderboard={showLeaderboard}
      leaderboard={leaderboard}
      loading={loadingLeaderboard}
    />


    <ExpenseList
      expenses={expenses}
      fetchExpenses={fetchExpenses}
      refreshLeaderboard={showLeaderboard ? fetchLeaderboard : null}
    />
    </>
  );
};

export default ExpensePage;
