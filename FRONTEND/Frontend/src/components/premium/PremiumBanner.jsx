const PremiumBanner = ({ isPremium }) =>
  isPremium ? (
    <h2 style={{ color: "gold", background: "#333", padding: "10px" }}>
      You are a Premium User 
    </h2>
  ) : null;

export default PremiumBanner;
