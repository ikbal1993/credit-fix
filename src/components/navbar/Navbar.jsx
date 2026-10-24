import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="logo-icon">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" />
        </Link>
      </div>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      {/* Menu */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;