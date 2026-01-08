import axios from "../../api/axios";

const BuyPremiumButton = ({ isPremium, cashfree, fetchUserProfile }) => {
  const buyPremium = async () => {
    if (!cashfree) return alert("SDK not loaded");

    const res = await axios.post("/payment/pay");
    const { paymentSessionId, orderId } = res.data;

    cashfree
      .checkout({ paymentSessionId, redirectTarget: "_modal" })
      .then(async () => {
        const status = await axios.get(`/payment/payment-status/${orderId}`);
        if (status.data.paymentStatus === "SUCCESS") {
          alert("Premium Activated");
          fetchUserProfile();
        }
      });
  };

  return (
    <button
      onClick={buyPremium}
      disabled={isPremium}
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md ${
        isPremium
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-linear-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 hover:shadow-lg"
      }`}
    >
      {isPremium ? "Premium User" : "Buy Premium"}
    </button>
  );
};

export default BuyPremiumButton;
