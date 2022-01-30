import React from "react";
import { useSelector } from "react-redux"; // hook react-redux permettant de lire le state redux
import { useDispatch } from "react-redux"; // hook react-redux permettant de lancer une action (run action)
import { useNavigate } from "react-router";

function SignIn() {
  //if (user) navigation.navigate("User"); // redirect vers par user si deja connecté
  const navigation = useNavigate();
  const dispatch = useDispatch(); // On utilise le hook useDispatch dans notre composant
  const userLogged = useSelector((state) => state.loggedIn); // On stock l'état de notre substate "logged in"

  // X - If user is logged already --> Redirect to user page

  const handleSubmit = () => {
    // On excecute la fonction dispatch avec une action
    dispatch({ type: "login" });
  };

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
          {/* Utiliser react hook form pour recuprerer les values dui form */}
          <button
            type="submit"
            className="sign-in-button"
            onClick={() => handleSubmit()}
          >
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}

export default SignIn;
