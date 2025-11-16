import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Hide navbar on login/register pages
  if (["/login", "/register"].includes(location.pathname)) return null;

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2563eb",
        color: "white",
        padding: "1rem 2rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ margin: 0 }}>Social Media Scheduler</h2>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <Link style={link} to="/dashboard">Dashboard</Link>
        <Link style={link} to="/create">Create Post</Link>
        <Link style={link} to="/posts">Posts</Link>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            color: "white",
            border: "1px solid white",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

const link: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
};

export default Navbar;
