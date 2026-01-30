import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div style={navbar}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={logo}>🛒</div>
        <div>
          <h3 style={{ margin: 0 }}>Big Bazaar Sales Prediction System</h3>
          <p style={subtitle}>Business Performance Overview & Analysis</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <NavLink to="/" style={({ isActive }) => navBtn(isActive)}>Dashboard</NavLink>
        <NavLink to="/analysis" style={({ isActive }) => navBtn(isActive)}>Analysis</NavLink>
        <NavLink to="/predict" style={({ isActive }) => navBtn(isActive)}>Sales Prediction</NavLink>
      </div>
    </div>
  );
};

/* styles */
const navbar = {
  background: "#fff",
  padding: "14px 22px",
  borderRadius: "14px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  marginBottom: "24px"
};

const logo = {
  width: "38px",
  height: "38px",
  background: "#f97316",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "18px"
};

const subtitle = {
  margin: 0,
  fontSize: "13px",
  color: "#64748b"
};

const navBtn = (active) => ({
  padding: "8px 16px",
  borderRadius: "999px",
  textDecoration: "none",
  background: active ? "#f97316" : "#f1f5f9",
  color: active ? "#fff" : "#334155",
  transition: "0.3s"
});

export default Navbar;
