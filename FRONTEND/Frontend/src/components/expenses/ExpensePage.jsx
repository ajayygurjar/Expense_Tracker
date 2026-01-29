import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useExpense } from "../../context/ExpenseContext";

import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

const ExpensePage = () => {
  const navigate = useNavigate();

  const { loading: authLoading } = useAuth();
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
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ExpenseForm />
        <ExpenseList />
      </div>
      
      {expenseLoading && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Processing...
        </div>
      )}
    </>
  );
};

export default ExpensePage;