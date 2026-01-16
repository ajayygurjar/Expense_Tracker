import { useAuth } from "../../context/AuthContext";
import { useLeaderboard } from "../../context/LeaderboardContext";
import BuyPremiumButton from "../premium/BuyPremiumButton";
import LogoutButton from "./LogoutButton";
import DownloadButton from "./DownloadButton";

const Header = () => {
  const { isPremium } = useAuth();
  const { toggleLeaderboard, showLeaderboard, loading } = useLeaderboard();

  const handleToggle = async () => {
    const result = await toggleLeaderboard();
    if (result && !result.success) {
      alert(result.message);
    }
  };
  return (
    <header className="bg-amber-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-indigo-600">
              Expense Tracker
            </h2>
            {isPremium && (
              <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                Premium
              </span>
            )}
          </div>

          
          <div className="flex items-center space-x-2">
            {isPremium && (
              <button
                onClick={handleToggle}
                disabled={loading}
                className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Loading..."
                  : showLeaderboard
                  ? "Hide Leaderboard"
                  : "Show Leaderboard"}
              </button>
            )}

            <BuyPremiumButton className="px-2 py-1 text-sm" />
            <DownloadButton className="px-2 py-1 text-sm" />
            <LogoutButton className="px-2 py-1 text-sm" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
