import BuyPremiumButton from '../premium/BuyPremiumButton';
import LogoutButton from "./LogoutButton";

const Header = ({
  isPremium,
  cashfree,
  fetchUserProfile,
  toggleLeaderboard,
  showLeaderboard,
  loadingLeaderboard,
  navigate,
}) => {
  return (
    <header>
      <h2 >Expense Tracker</h2>

      <div >
        {isPremium && (
          <span >Premium</span>
        )}

        {isPremium && (
          <button
            onClick={toggleLeaderboard}
            disabled={loadingLeaderboard}
            
          >
            {loadingLeaderboard
              ? "Loading..."
              : showLeaderboard
              ? "Hide Leaderboard"
              : "Show Leaderboard"}
          </button>
        )}

        <BuyPremiumButton
          isPremium={isPremium}
          cashfree={cashfree}
          fetchUserProfile={fetchUserProfile}
        />

        <LogoutButton navigate={navigate} />
      </div>
    </header>
  );
};
export default Header;
