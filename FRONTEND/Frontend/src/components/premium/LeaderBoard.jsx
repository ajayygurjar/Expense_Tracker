const Leaderboard = ({ isPremium, showLeaderboard, leaderboard, loading }) => {
  if (!isPremium || !showLeaderboard) return null;

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
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
    </>
  );
};

export default Leaderboard;
