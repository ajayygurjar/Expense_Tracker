import { useAuth } from "../../context/AuthContext";

const LogoutButton = ({ className = "" }) => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className={`px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-md ${className}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;