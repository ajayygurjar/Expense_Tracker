import BuyPremiumButton from "../premium/BuyPremiumButton";
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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-indigo-600">
              Expense Tracker
            </h2>

            <div className="flex items-center space-x-3">
              {isPremium && (
                <span className="bg-linear-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                  Premium
                </span>
              )}

              {isPremium && (
                <button
                  onClick={toggleLeaderboard}
                  disabled={loadingLeaderboard}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
