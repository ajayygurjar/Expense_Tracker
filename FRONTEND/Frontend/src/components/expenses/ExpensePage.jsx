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

  const [loading,setLoading]=useState(true); 

  //leader board
   const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);


  //logout handler
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isPremium");
    alert("Logged out successfully");
    navigate("/");
  };

    const fetchUserProfile = async () => {
    try {
      
      const res = await axios.get("/premium/profile");
      
      
      const premiumStatus = res.data.user.isPremium;
      
      
      setIsPremium(premiumStatus);
      
      
      localStorage.setItem("isPremium", premiumStatus);
      
    } catch (error) {
      console.error("Error fetching user profile", error);
    } finally {
      setLoading(false);     }
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

   const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const res = await axios.get("/premium/leaderboard");
  
      setLeaderboard(res.data.leaderboard);
      setShowLeaderboard(true);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      if (error.response?.status === 403) {
        alert("This feature is only available for premium members!");
      } else {
        alert("Failed to fetch leaderboard");
      }
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  
  const toggleLeaderboard = () => {
    if (showLeaderboard) {
      
      setShowLeaderboard(false);
    } else {
      
      fetchLeaderboard();
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchUserProfile();
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

           if (showLeaderboard) {
        fetchLeaderboard();
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`/expenses/${id}`);
      alert("Expense deleted sucessfully");
      fetchExpenses();
      if (showLeaderboard) {
        fetchLeaderboard();
      }
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
              await fetchUserProfile(); 
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
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
     {isPremium && (
        <h2 style={{ 
          textAlign: "center", 
          color: "gold", 
          marginBottom: "20px",
          backgroundColor: "#333",
          padding: "15px",
          borderRadius: "5px"
        }}>
          You are a premium user now
        </h2>
      )}
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


        {isPremium && (
        <button
          onClick={toggleLeaderboard}
          style={{
            float: "right",
            marginBottom: "20px",
            marginRight: "10px",
            background: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            cursor: "pointer",
            border: "none",
            borderRadius: "5px",
          }}
          disabled={loadingLeaderboard}
        >
          {loadingLeaderboard
            ? "Loading..."
            : showLeaderboard
            ? "Hide Leaderboard"
            : "Show Leaderboard"}
        </button>
      )}

      <br style={{ clear: "both" }} />

      {/* Leaderboard Display */}
      
      {showLeaderboard && (
  <>
    <h2>Expense Leaderboard</h2>

    {leaderboard.length === 0 ? (
      <p>No data available</p>
    ) : (
      leaderboard.map((user, index) => (
        <div key={user.id}>
          <span>{index > 2 && `#${index + 1} `}</span>
          <strong>{user.name}</strong>
          <div>₹{user.total_cost.toFixed(2)}</div>
        </div>
      ))
    )}
  </>
)}

      <h3>Expnese Form</h3>
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
