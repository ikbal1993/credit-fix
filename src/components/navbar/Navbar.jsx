import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="logo-icon">
        <Link to="/">
          <img src="/logo.png" alt="Logo" />
        </Link>
      </div>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      {/* Menu */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="/services">Services</a>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;