import { useExpense } from "../../context/ExpenseContext";
import { useLeaderboard } from "../../context/LeaderboardContext";

const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpense();
  const { showLeaderboard, fetchLeaderboard } = useLeaderboard();

  // Handle expense deletion
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    const result = await deleteExpense(id);
    if (result.success) {
      if (showLeaderboard) {
        fetchLeaderboard();
      }
    } else {
      alert(result.message || "Failed to delete expense");
    }
  };

  // If no expenses exist
  if (!expenses || expenses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Expenses</h2>
          <p className="text-gray-600">No expenses yet. Add your first expense!</p>
        </div>
      </div>
    );
  }

  // Render expense table
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Expenses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-4 text-left">Amount (₹)</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="even:bg-gray-50 odd:bg-white">
                  <td className="py-2 px-4">₹{exp.amount}</td>
                  <td className="py-2 px-4">{exp.description}</td>
                  <td className="py-2 px-4">{exp.category}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteHandler(exp.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
