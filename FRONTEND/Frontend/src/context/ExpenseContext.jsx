import axios from "../api/axios";
import { useState, useCallback, createContext, useContext, useEffect } from "react";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [recentCategories, setRecentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchExpenses = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(`/expenses?page=${page}&pageSize=${pageSize}`);
      setExpenses(res.data.expenses || []);
      setPagination(
        res.data.pagination || {
          currentPage: page,
          pageSize,
          totalPages: 1,
          totalCount: 0,
        }
      );
      setError(null);
    } catch (error) {
      console.error("Error fetching expenses", error);
      setExpenses([]);
      setError(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial expenses only once on mount
  useEffect(() => {
    fetchExpenses(1, 10);
  }, [fetchExpenses]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("/expenses/categories");
      setRecentCategories(res.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories", error);
      setRecentCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addExpense = async (expenseData) => {
    setLoading(true);
    try {
      await axios.post("/expenses/add", expenseData);
      // After adding, go to first page with current pageSize
      await fetchExpenses(1, pagination.pageSize);
      await fetchCategories();
      setError(null);
      return { success: true };
    } catch (error) {
      console.error("Error adding expense", error);
      const message = error.response?.data?.message || "Failed to add expense";
      setError(message);
      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/expenses/${id}`);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error("Error deleting expense", error);
      const message = error.response?.data?.message || "Failed to delete expense";
      setError(message);
      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedCategory = async (description) => {
    try {
      const res = await axios.post("/ai/suggest", { description });
      return {
        success: true,
        suggestedCategory: res.data.suggestedCategory,
        source: res.data.source,
      };
    } catch (error) {
      console.error("Error getting AI suggested category", error);
      return { success: false };
    }
  };

  const value = {
    expenses,
    recentCategories,
    loading,
    error,
    pagination,
    fetchExpenses,
    fetchCategories,
    addExpense,
    deleteExpense,
    getSuggestedCategory,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within ExpenseProvider");
  }
  return context;
};