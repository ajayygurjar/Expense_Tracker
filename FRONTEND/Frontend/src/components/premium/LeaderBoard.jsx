const Leaderboard = ({ isPremium, showLeaderboard, leaderboard, loading }) => {
  if (!isPremium || !showLeaderboard) return null;

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  return (
    <>
      <h2>Leaderboard</h2>

      {leaderboard.length === 0 ? (
        <p>No data available</p>
      ) : (
        leaderboard.map((user, index) => (
          <div key={user.id}>
            #{index + 1} {user.name} – ₹{user.total_cost.toFixed(2)}
          </div>
        ))
      )}
    </>
  );
};

export default Leaderboard;
