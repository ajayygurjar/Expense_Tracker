import axios from "../../api/axios";

const BuyPremiumButton = ({ isPremium, cashfree, fetchUserProfile }) => {
  const buyPremium = async () => {
    if (!cashfree) return alert("SDK not loaded");

    const res = await axios.post("/payment/pay");
    const { paymentSessionId, orderId } = res.data;

    cashfree.checkout({ paymentSessionId, redirectTarget: "_modal" })
      .then(async () => {
        const status = await axios.get(`/payment/payment-status/${orderId}`);
        if (status.data.paymentStatus === "SUCCESS") {
          alert("Premium Activated");
          fetchUserProfile();
        }
      });
  };

  return (
    <button onClick={buyPremium} disabled={isPremium}>
      {isPremium ? "Premium User" : "Buy Premium"}
    </button>
  );
};

export default BuyPremiumButton;
