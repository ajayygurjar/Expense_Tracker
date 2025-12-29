import { useState } from "react";

const ExpensePage = () => {
  const [ExpenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
  });

  //Change Handler
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  
  //Handle Submit Request
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(ExpenseData);
  };

  return (
    <>
      <h1>Expense Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="expenseAmount">Expense Amount</label>
        <input
          type="number"
          id="expenseAmount"
          name="amount"
          value={ExpenseData.amount}
          onChange={changeHandler}
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={ExpenseData.description}
          onChange={changeHandler}
        />
        <label htmlFor="expenseCategory">Expense Category</label>
        <select
          id="expenseCategory"
          name="category"
          value={ExpenseData.description}
          onChange={changeHandler}
        >
          <option value="">Select category</option>
          <option value="food">Food</option>
          <option value="petrol">Petrol</option>
          <option value="travel">Travel</option>
        </select>
        <button>Submit</button>
      </form>
    </>
  );
};

export default ExpensePage;
