import { useEffect, useState } from "react";
import axios from "../../api/axios";
import DownloadButton from "../layout/DownloadButton";

const Report = () => {
  const [summary, setSummary] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("/expenses/report");
        setSummary(res.data.monthlySummary);
        setExpenses(res.data.expenses);
        setTotal(res.data.totalExpense);
      } catch (error) {
        console.error("Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const formatMonth = (month) =>
    new Date(2024, month - 1).toLocaleString("default", { month: "long" });

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">
          Expense Report
        </h1>
        <DownloadButton /> 
      </div>

      <p className="mb-6 text-lg font-semibold">Total Expense: ₹{total}</p>

      {/* Monthly Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Year</th>
              <th className="text-left py-2">Month</th>
              <th className="text-left py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{row.year}</td>
                <td className="py-2">{formatMonth(row.month)}</td>
                <td className="py-2 font-semibold">
                  ₹{Number(row.totalAmount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expense Details */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Expense Details</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Description</th>
              <th className="text-left py-2">Category</th>
              <th className="text-left py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b">
                <td className="py-2">
                  {new Date(exp.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2">{exp.description}</td>
                <td className="py-2">{exp.category}</td>
                <td className="py-2 font-medium">₹{exp.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
