import axios from "../../api/axios";

const ExpenseList = ({ expenses, fetchExpenses, refreshLeaderboard }) => {
  const deleteHandler = async (id) => {
    await axios.delete(`/expenses/${id}`);
    fetchExpenses();
    refreshLeaderboard && refreshLeaderboard();
  };

  return (
    <>
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

export default ExpenseList;
