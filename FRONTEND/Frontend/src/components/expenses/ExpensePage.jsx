import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useExpense } from "../../context/ExpenseContext";

import Header from "../layout/Header";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Leaderboard from "../premium/Leaderboard";
import PremiumBanner from "../premium/PremiumBanner";

const ExpensePage = () => {
  const navigate = useNavigate();

  const { isPremium, loading: authLoading } = useAuth();
  const { fetchExpenses, loading: expenseLoading } = useExpense();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchExpenses();
  }, [fetchExpenses, navigate]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PremiumBanner isPremium={isPremium} />
      <Header />
      <ExpenseForm />
      <Leaderboard />
      <ExpenseList />
      {expenseLoading && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Processing...
        </div>
      )}
    </div>
  );
};

export default ExpensePage;