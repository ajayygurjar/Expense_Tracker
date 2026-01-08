const LogoutButton = ({ navigate }) => {
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;
