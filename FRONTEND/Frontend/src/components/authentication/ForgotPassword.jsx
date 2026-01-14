import { useState } from "react";
import axios from "../../api/axios";

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetId, setResetId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setResetId("");

    try {
      const res = await axios.post("/password/forgotpassword", { email });

      if (res.data.success) {
        setMessage(res.data.message);
        setResetId(res.data.resetId);
        setEmail("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Password</h2>
      <p className="text-gray-600 mb-6">
        Enter your email to receive reset instructions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-gray-700 font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>{message}</p>
            {resetId && (
              <div className="mt-2 pt-2 border-t border-green-300">
                <p className="text-sm">
                  If email doesn't arrive, use this link:
                </p>
                <a
                  href={`http://localhost:5000/api/password/resetpassword/${resetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm break-all"
                >
                  Reset Password Link
                </a>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
