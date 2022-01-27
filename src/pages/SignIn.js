import React from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../data/userRoutes";

function SignIn() {
  //const user = // Recup etat user;
  const navigation = useNavigate();
  //if (user) navigation.navigate("User"); // redirect vers par user si deja connecté
  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form>
          <div className="input-wrapper">
            <label for="username">Username</label>
            <input type="text" id="username" />
          </div>
          <div className="input-wrapper">
            <label for="password">Password</label>
            <input type="password" id="password" />
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" />
            <label for="remember-me">Remember me</label>
          </div>
          {/* <!-- PLACEHOLDER DUE TO STATIC SITE --> */}

          {/* <!-- SHOULD BE THE BUTTON BELOW --> */}
          <button type="submit" className="sign-in-button" onClick={() => ""}>
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}

export default SignIn;
