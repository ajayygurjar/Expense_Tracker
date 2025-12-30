import axios from "axios";
import { useEffect, useState } from "react";

const ExpensePage = () => {
  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
  });


  const [expenses,setExpenses]=useState([])

  useEffect(()=>{
    fetchExpenses();
  },[])


  //fetch expenses
  const fetchExpenses=async()=>{
    try {
        const res= await axios.get('http://localhost:5000/api/expenses');
        setExpenses(res.data.expenses || []);
    } catch (error) {
        console.error("error fetching expenses",error);
        alert("failed to fetch expenses")
        
    }
  }
  //Change Handler
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Handle Submit Request
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/expenses/add",
        expenseData
      );

      alert(res.data.message);

      // clear form
      setExpenseData({
        amount: "",
        description: "",
        category: "",
      });
    } catch (error) {
      console.log(error);
    }
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
          value={expenseData.amount}
          onChange={changeHandler}
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={expenseData.description}
          onChange={changeHandler}
        />
        <label htmlFor="expenseCategory">Expense Category</label>
        <select
          id="expenseCategory"
          name="category"
          value={expenseData.category}
          onChange={changeHandler}
        >
          <option value="">Select category</option>
          <option value="food">Food</option>
          <option value="petrol">Petrol</option>
          <option value="travel">Travel</option>
        </select>
        <button>Submit</button>
      </form>

      <hr/>
      {expenses.map((exp) => (
        <div key={exp.id}>
          ₹{exp.amount} - {exp.description} ({exp.category})
          <button>Delete</button>
        </div>
      ))}
    </>
  );
};

export default ExpensePage;
