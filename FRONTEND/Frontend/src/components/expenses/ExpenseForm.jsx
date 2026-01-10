import { useState, useRef, useEffect } from "react";
import axios from "../../api/axios";

const ExpenseForm = ({ fetchExpenses }) => {
  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [recentCategories, setRecentCategories] = useState([]);
  const lastDescriptionRef = useRef("");

  useEffect(() => {
    axios.get("/expenses/categories").then((res) => {
      setRecentCategories(res.data.categories || []);
    });
  }, []);

  const handleAiSuggest = async () => {
    const description = expenseData.description.trim().toLowerCase();

    if (description.length < 3) {
      alert("Please enter a longer description first!");
      return;
    }
    if (lastDescriptionRef.current === description) return;

    setLoading(true);
    try {
      const res = await axios.post("/ai/suggest", { description });
      const aiCategory = res.data?.suggestedCategory;

      if (aiCategory) {
        setExpenseData((prev) => ({
          ...prev,
          category: aiCategory,
        }));
        lastDescriptionRef.current = description;
      }
    } catch (err) {
      console.error("AI Suggestion failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/expenses/add", expenseData);
      setExpenseData({ amount: "", description: "", category: "" });
      lastDescriptionRef.current = "";
      fetchExpenses();
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          Expense Form
        </h3>
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={expenseData.amount}
                onChange={changeHandler}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={expenseData.description}
                  onChange={changeHandler}
                  required
                />

                <button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all border ${
                    loading
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 active:scale-95"
                  }`}
                >
                  {loading ? "Analyzing..." : "Auto-Fill Category"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={expenseData.category}
                onChange={changeHandler}
                list="cats"
              />
              <datalist id="cats">
                {recentCategories.map((cat, i) => (
                  <option key={i} value={cat} />
                ))}
              </datalist>
            </div>
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg">
            Add Expense
          </button>
        </form>
      </div>
    </>
  );
};

export default ExpenseForm;
