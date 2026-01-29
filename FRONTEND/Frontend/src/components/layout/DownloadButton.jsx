import { useState } from "react";
import axios from "../../api/axios";

const DownloadButton = ({ className = "" }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await axios.get("/expenses/download", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expenses-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expenses:", error);
      alert("Failed to download expenses");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`px-4 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-all duration-200 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
    >
      {downloading ? "Downloading..." : "Download"}
    </button>
  );
};

export default DownloadButton;