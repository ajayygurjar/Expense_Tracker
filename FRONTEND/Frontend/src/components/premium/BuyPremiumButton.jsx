import { useAuth } from "../../context/AuthContext";
import { usePayment } from "../../context/PaymentContext";

const BuyPremiumButton = () => {
  const { isPremium } = useAuth();
  const { buyPremium, processing, error } = usePayment();

  if (isPremium) return null;

  const handleBuyPremium = async () => {
    if (processing) return;

    const result = await buyPremium();

    if (result.success) {
      alert(result.message);
    } else if (result.message) {
      if (result.message.includes("SDK not loaded")) {
        alert("Payment system is loading. Please wait a moment and try again.");
      } else if (result.message.includes("paymentSessionId")) {
        alert(
          "Technical error: Unable to initialize payment. Please contact support."
        );
      } else {
        alert(result.message);
      }
    }
  };

  if (error && !isPremium) {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-lg font-semibold bg-red-300 text-red-700 cursor-not-allowed"
        title={error}
      >
        Payment Unavailable
      </button>
    );
  }

  return (
    <button
      onClick={handleBuyPremium}
      disabled={isPremium || processing}
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md ${
        isPremium || processing
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-lg"
      }`}
    >
      {processing ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">Loading...</span>
        </span>
      ) : isPremium ? (
        "Premium User"
      ) : (
        "Buy Premium"
      )}
    </button>
  );
};

export default BuyPremiumButton;
