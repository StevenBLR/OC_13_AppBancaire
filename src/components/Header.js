import React from "react";
import { useSelector, useStore } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/user";
import { selectUser } from "../utils/selectors";

function Header() {
  const store = useStore();
  const userLoggedIn = useSelector(selectUser).token;

  // Logout
  async function logoutUser() {
    logout(store);
  }

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
        {userLoggedIn ? (
          <Link to="/" className="main-nav-item" onClick={() => logoutUser()}>
            Sign out
          </Link>
        ) : (
          <Link to="/signin" className="main-nav-item">
            Sign in
          </Link>
        )}

        <i className="fa fa-user-circle"></i>
      </div>
    </nav>
  );
}

export default Header;
