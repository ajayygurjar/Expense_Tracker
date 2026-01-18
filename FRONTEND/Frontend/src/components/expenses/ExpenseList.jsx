import { useState, useEffect } from "react";
import { useExpense } from "../../context/ExpenseContext";
import { useLeaderboard } from "../../context/LeaderboardContext";

const ExpenseList = () => {
  const { expenses, deleteExpense, pagination, fetchExpenses } = useExpense();
  const { showLeaderboard, fetchLeaderboard } = useLeaderboard();

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchExpenses(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    const result = await deleteExpense(id);
    if (result.success) {
      if (showLeaderboard) fetchLeaderboard();

      const remainingItemsOnPage = expenses.length - 1;
      if (remainingItemsOnPage === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchExpenses(currentPage, itemsPerPage);
      }
    } else {
      alert(result.message || "Failed to delete expense");
    }
  };

  const handlePageSizeChange = (newSize) => {
    const size = parseInt(newSize, 10);
    if (size >= 1 && size <= 100) {
      setItemsPerPage(size);
      setCurrentPage(1);
      setShowSettings(false);
    }
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Your Expenses
        </h2>
        <p className="text-gray-600">No expenses yet. Add your first expense!</p>
      </div>
    );
  }

  const totalPages = pagination?.totalPages || 1;
  const totalCount = pagination?.totalCount || 0;

  let pageNumbers = [];
  if (totalPages <= 7) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 4) {
      pageNumbers = [1, 2, 3, 4, 5, "...", totalPages];
    } else if (currentPage >= totalPages - 3) {
      pageNumbers = [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pageNumbers = [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Expenses</h2>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm"
          >
            {itemsPerPage} per page
          </button>

          {showSettings && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 w-64">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700">
                  Items per page
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20, 25, 30, 50, 100].map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${itemsPerPage === size
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
          expenses
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b">
              <th className="text-left py-2 px-2">Amount</th>
              <th className="text-left py-2 px-2">Description</th>
              <th className="text-left py-2 px-2">Category</th>
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">Rs. {exp.amount}</td>
                <td className="py-2 px-2">{exp.description}</td>
                <td className="py-2 px-2">{exp.category}</td>
                <td className="py-2 px-2">
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

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Prev
          </button>

          {pageNumbers.map((number, index) =>
            number === "..." ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1">
                ...
              </span>
            ) : (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-1 rounded ${number === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {number}
              </button>
            )
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;