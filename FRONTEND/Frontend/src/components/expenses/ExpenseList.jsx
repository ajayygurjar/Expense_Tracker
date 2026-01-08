import axios from "../../api/axios";

const ExpenseList = ({ expenses, fetchExpenses, refreshLeaderboard }) => {
  const deleteHandler = async (id) => {
    await axios.delete(`/expenses/${id}`);
    fetchExpenses();
    refreshLeaderboard && refreshLeaderboard();
  };

  return (
    <>
      <div className="overflow-x-auto mt-4">
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
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ExpenseList;
