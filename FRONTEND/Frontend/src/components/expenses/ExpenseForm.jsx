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
      <h3>Expense Form</h3>
      <form onSubmit={submitHandler}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expenseData.amount}
          onChange={changeHandler}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={expenseData.description}
          onChange={changeHandler}
        />
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
        <button>Add Expense</button>
      </form>
    </>
  );
};

export default ExpenseForm;
