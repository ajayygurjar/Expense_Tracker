import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BuyPremiumButton from "../premium/BuyPremiumButton";
import LogoutButton from "./LogoutButton";
import DownloadButton from "./DownloadButton";

const Header = () => {
  const { isPremium } = useAuth();

  return (
    <header className="bg-amber-200 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          
          <div className="flex items-center space-x-2">
            <NavLink to="/expenses">
              <h2 className="text-2xl font-bold text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors">
                Expense Tracker
              </h2>
            </NavLink>
            {isPremium && (
              <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                Premium
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-2">
              <NavLink
                to="/expenses"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`
                }
              >
                Expenses
              </NavLink>

              {isPremium && (
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`
                  }
                >
                  Leaderboard
                </NavLink>
              )}
            </nav>

            <div className="flex items-center space-x-2">
              <BuyPremiumButton className="px-2 py-1 text-sm" />
              <DownloadButton className="px-2 py-1 text-sm" />
              <LogoutButton className="px-2 py-1 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;