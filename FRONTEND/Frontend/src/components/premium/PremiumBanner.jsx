const PremiumBanner = ({ isPremium }) =>
  isPremium ? (
    <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center space-x-3">
          <h2 className="text-xl font-bold text-white">
            You are a Premium User
          </h2>
        </div>
      </div>
    </div>
  ) : null;

export default PremiumBanner;
