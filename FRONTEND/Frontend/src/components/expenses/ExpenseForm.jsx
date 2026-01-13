import { useState, useRef, useEffect } from "react";
import axios from "../../api/axios";

const ExpenseForm = ({ fetchExpenses }) => {
  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [sourceTag, setSourceTag] = useState(""); // ✨ New: Tracks AI vs Local
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
      const { suggestedCategory, source } = res.data;

      if (suggestedCategory) {
        setExpenseData((prev) => ({ ...prev, category: suggestedCategory }));
        setSourceTag(source === "gemini" ? "✨ AI Suggested" : "🔍 Local Match");
        
        // Hide tag after 3 seconds
        setTimeout(() => setSourceTag(""), 3000);
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
      setSourceTag("");
      lastDescriptionRef.current = "";
      fetchExpenses();
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex justify-between items-center">
        Add New Expense
        {sourceTag && (
          <span className={`text-[10px] px-2 py-1 rounded-full animate-pulse ${
            sourceTag.includes("AI") ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
          }`}>
            {sourceTag}
          </span>
        )}
      </h3>
      
      <form onSubmit={submitHandler} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Amount Input */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Amount (₹)</label>
            <input
              className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              type="number"
              name="amount"
              placeholder="0.00"
              value={expenseData.amount}
              onChange={changeHandler}
              required
            />
          </div>

          {/* Description Input + AI Button */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Description</label>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                type="text"
                name="description"
                placeholder="e.g. Dinner at KFC"
                value={expenseData.description}
                onChange={changeHandler}
                required
              />
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={loading}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                  loading 
                  ? "bg-gray-50 text-gray-400 border-gray-200" 
                  : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                }`}
              >
                {loading ? "..." : "AI"}
              </button>
            </div>
          </div>

          {/* Category Input */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Category</label>
            <input
              className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              type="text"
              name="category"
              placeholder="Category"
              value={expenseData.category}
              onChange={changeHandler}
              list="cats"
              required
            />
            <datalist id="cats">
              {recentCategories.map((cat, i) => (
                <option key={i} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-[0.98]"
        >
          Save Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;