import { useAuth } from "../../context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors duration-200"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
