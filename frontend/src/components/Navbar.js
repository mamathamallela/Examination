import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="bg logo.png" alt="Brightcom Logo" className="logo" />
        <span className="brand-title">
          <h1>Brightcom</h1>
        </span>
      </div>
      <ul className="nav-list">
        <li className="nav-item dropdown">
          <button className="nav-link">
            Home
          </button>
          <div className="dropdown-content">
            <button>Learning</button>
            <button>Exercise</button>
            <button>Schedule</button>
          </div>
        </li>
        <li className="nav-item dropdown">
          <button className="nav-link">
            About
          </button>
          <div className="dropdown-content">
            <button>Learning</button>
            <button>Exercise</button>
            <button>Schedule</button>
          </div>
        </li>
        <li className="nav-item dropdown">
          <button className="nav-link">
            Services
          </button>
          <div className="dropdown-content">
            <button>Learning</button>
            <button>Exercise</button>
            <button>Schedule</button>
          </div>
        </li>
        <li className="nav-item dropdown">
          <button className="nav-link">
            Contact
          </button>
          <div className="dropdown-content">
            <button>Learning</button>
            <button>Exercise</button>
            <button>Schedule</button>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a href="/signup">
            <button>Login Admin</button>
          </a>
          <a href="/login">
            <button>Log In</button>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
