import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="main-nav">
      <Link to="/" className="main-nav-logo">
        <img
          className="main-nav-logo-image"
          src="/img/argentBankLogo.png"
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <div>
        <Link to="/signin" className="main-nav-item">
          Sign in
        </Link>
        <i className="fa fa-user-circle"></i>
      </div>
    </nav>
  );
}

export default Header;
