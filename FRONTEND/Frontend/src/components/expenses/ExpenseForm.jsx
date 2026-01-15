import { useState, useRef, useEffect } from "react";
import { useExpense } from "../../context/ExpenseContext";

const ExpenseForm = () => {
  const { recentCategories, fetchCategories, addExpense, getSuggestedCategory } = useExpense();

  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
  });

  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [sourceTag, setSourceTag] = useState("");
  const lastDescriptionRef = useRef("");

  // Fetch recent categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle AI suggestion for category
  const handleAiSuggest = async () => {
    const description = expenseData.description.trim();

    if (description.length < 3) {
      alert("Please enter a longer description first!");
      return;
    }

    if (lastDescriptionRef.current === description) return;

    setLoadingSuggestion(true);

    try {
      const result = await getSuggestedCategory(description);

      if (result.success) {
        setExpenseData((prev) => ({
          ...prev,
          category: result.suggestedCategory,
        }));

        setSourceTag(result.source === "gemini" ? "AI Suggested" : "Local Match");

        // Remove source tag after 3 seconds
        setTimeout(() => setSourceTag(""), 3000);

        lastDescriptionRef.current = description;
      } else {
        alert("Failed to get category suggestion");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching category suggestion");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  // Handle input changes
  const changeHandler = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();

    const { amount, description, category } = expenseData;

    if (!amount || !description || !category) {
      alert("Please fill all fields");
      return;
    }

    const result = await addExpense(expenseData);

    if (result.success) {
      alert("Expense added successfully!");
      setExpenseData({ amount: "", description: "", category: "" });
      setSourceTag("");
      lastDescriptionRef.current = "";
    } else {
      alert(result.message || "Failed to add expense");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-100 max-w-7xl mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex justify-between items-center">
        Add New Expense
        {sourceTag && (
          <span
            className={`text-[10px] px-2 py-1 rounded-full animate-pulse ${
              sourceTag.includes("AI")
                ? "bg-purple-100 text-purple-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {sourceTag}
          </span>
        )}
      </h3>

      <form onSubmit={submitHandler} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Amount */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={expenseData.amount}
              onChange={changeHandler}
              className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Description + AI Suggest */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Description
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="description"
                placeholder="e.g. Dinner at KFC"
                value={expenseData.description}
                onChange={changeHandler}
                className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={loadingSuggestion}
                className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                  loadingSuggestion
                    ? "bg-gray-50 text-gray-400 border-gray-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                }`}
              >
                {loadingSuggestion ? "..." : "AI Suggest"}
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={expenseData.category}
              onChange={changeHandler}
              list="cats"
              className="border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
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
