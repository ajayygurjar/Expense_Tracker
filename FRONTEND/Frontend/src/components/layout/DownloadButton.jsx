import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useExpense } from "../../context/ExpenseContext";

const DownloadButton = () => {
  const { isPremium } = useAuth();
  const { expenses } = useExpense();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!isPremium) return alert("Premium feature only!");
    if (!expenses?.length) return alert("No expenses to download!");

    setDownloading(true);

    try {
      const csvRows = ["Day to Day Expenses", new Date().toLocaleString(), ""];
      const groupedData = {};

      // Group by year and month
      expenses.forEach((exp) => {
        const date = new Date(exp.createdAt);
        const key = `${date.getFullYear()}-${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`;
        if (!groupedData[key]) groupedData[key] = { expenses: [], total: 0 };
        groupedData[key].expenses.push(exp);
        groupedData[key].total += parseFloat(exp.amount);
      });

      // Generate CSV
      Object.keys(groupedData).sort().reverse().forEach((key) => {
        const [year, monthYear] = key.split("-");
        const data = groupedData[key];

        csvRows.push(year, "", monthYear, "Date,Description,Category,Expense");

        data.expenses.forEach((exp) => {
          const date = new Date(exp.createdAt);
          const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
          csvRows.push(`"${formattedDate}","${exp.description}","${exp.category}","₹${parseFloat(exp.amount).toFixed(2)}"`);
        });

        csvRows.push(`,,,"Total: ₹${data.total.toFixed(2)}"`, "");
      });

      // Download
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Expenses_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      alert("Downloaded successfully!");
    } catch (error) {
      alert("Download failed!");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!isPremium || downloading}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        !isPremium ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
      }`}
    >
      {downloading ? " Downloading..." : "Download"}
    </button>
  );
};

export default DownloadButton;