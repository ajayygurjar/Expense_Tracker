import { useState } from "react";
import axios from "../../api/axios";

const ExpenseForm = ({ fetchExpenses }) => {
  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
  });

  const changeHandler = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await axios.post("/expenses/add", expenseData);
    setExpenseData({ amount: "", description: "", category: "" });
    fetchExpenses();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-">
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
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={expenseData.description}
                onChange={changeHandler}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={expenseData.category}
                onChange={changeHandler}
              >
                <option value="">Select Category</option>
                <option value="food">Food</option>
                <option value="petrol">Petrol</option>
                <option value="travel">Travel</option>
              </select>
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
