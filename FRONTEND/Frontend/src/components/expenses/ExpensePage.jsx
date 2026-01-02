import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

const ExpensePage = () => {
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
  });

  const [expenses, setExpenses] = useState([]);

  //CashFree States
  const [cashfree, setCashfree] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  //logout handler
  const logoutHandler = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/");
  };

  //fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/expenses");
      setExpenses(res.data.expenses);
    } catch (error) {
      console.error("error fetching expenses", error);
      alert("Unauthorized");
      navigate("/");
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchExpenses();
    load({ mode: "sandbox" }).then((cf) => setCashfree(cf));
  }, [navigate]);

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
      const res = await axios.post("/expenses/add", expenseData);

      alert(res.data.message);

      // clear form
      setExpenseData({
        amount: "",
        description: "",
        category: "",
      });
      fetchExpenses();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`/expenses/${id}`);
      alert("Expense deleted sucessfully");
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense", error);
      alert("falid to delete expense");
    }
  };

  //Buy Premium
  const buyPremiumHandler = async () => {
    if (!cashfree) return alert("Payment SDK not loaded yet");

    try {
      // Create order in backend
      const res = await axios.post("/payment/pay");
      const { paymentSessionId, orderId } = res.data;

      // Cashfree popup
      cashfree
        .checkout({
          paymentSessionId,
          redirectTarget: "_modal",
        })
        .then(async (result) => {
          if (result.error) {
            alert("Transaction Failed");
            console.log(result.error);

            // Update order status to FAILED
            await axios.get(`/payment/payment-status/${orderId}`);
          }

          if (result.paymentDetails) {
            // Check payment status from backend
            const statusRes = await axios.get(
              `/payment/payment-status/${orderId}`
            );

            if (statusRes.data.paymentStatus === "SUCCESS") {
              alert("Transaction Successful! You are now a Premium User.");
              setIsPremium(true);
            } else {
              alert("Transaction Failed!");
            }
          }
        });
    } catch (error) {
      console.error("Error in premium purchase:", error);
      alert("Failed to initiate payment");
    }
  };

  return (
    <>
      <h1>Expense Page</h1>
      <button onClick={logoutHandler} style={{ marginBottom: "10px" }}>
        Logout
      </button>

      <button
        onClick={buyPremiumHandler}
        style={{
          float: "right",
          marginBottom: "20px",
          background: "gold",
          padding: "10px",
        }}
        disabled={isPremium}
      >
        {isPremium ? "Premium User" : "Buy Premium"}
      </button>
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

      <hr />
      {expenses.map((exp) => (
        <div key={exp.id}>
          ₹{exp.amount} - {exp.description} ({exp.category})
          <button onClick={() => deleteHandler(exp.id)}>Delete</button>
        </div>
      ))}
    </>
  );
};

export default ExpensePage;
