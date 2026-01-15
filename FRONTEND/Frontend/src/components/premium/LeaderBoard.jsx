import { useAuth } from "../../context/AuthContext";
import { useLeaderboard } from "../../context/LeaderboardContext";

const Leaderboard = () => {
  const { isPremium } = useAuth();
  const { showLeaderboard, leaderboard, loading } = useLeaderboard();

  if (!isPremium || !showLeaderboard) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        
        <p className="text-gray-600">Loading leaderboard...</p>{" "}
        
      </div>
    );
  }
   if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Leaderboard</h2>
          <p className="text-gray-600">No leaderboard data available yet.</p> 
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Leaderboard</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Total Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">₹{user.total_cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
};

export default Leaderboard;
