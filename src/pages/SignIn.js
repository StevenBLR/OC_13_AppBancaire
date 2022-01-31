import React, { useEffect } from "react";
import { useForm } from "react-hook-form"; // hook permettant de recuperer facilement le contenu d'un formulaire
import { useSelector } from "react-redux"; // hook react-redux permettant de lire le state redux
import { useDispatch } from "react-redux"; // hook react-redux permettant de lancer une action (run action)
import { useNavigate } from "react-router";

function SignIn() {
  const navigation = useNavigate();
  //const dispatch = useDispatch(); // On utilise le hook useDispatch dans notre composant
  //const userLogged = useSelector((state) => state.loggedIn); // On stock l'état de notre substate "logged in"
  const { register, handleSubmit } = useForm();

  // Login with user credentials
  // const handleSubmit = () => {
  //   // On excecute la fonction dispatch avec une action
  //   dispatch({ type: "login" });
  // };

  // Redirect user to previous page if he is already logged in
  // useEffect(() => {
  //   if (!userLogged) {
  //     navigation(-1); // Go back to previous page
  //   }
  // }, [userLogged, navigation]);

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form
          onSubmit={handleSubmit((data) => {
            console.log(data);
          })}
        >
          <div className="input-wrapper">
            <label for="username">Username</label>
            <input {...register("userName")} type="text" id="username" />
          </div>
          <div className="input-wrapper">
            <label for="password">Password</label>
            <input {...register("password")} type="password" id="password" />
          </div>
          <div className="input-remember">
            <input
              {...register("remember-me")}
              type="checkbox"
              id="remember-me"
            />
            <label for="remember-me">Remember me</label>
          </div>
          {/* <!-- PLACEHOLDER DUE TO STATIC SITE --> */}

          {/* <!-- SHOULD BE THE BUTTON BELOW --> */}
          {/* Utiliser react hook form pour recuprerer les values dui form */}
          <button type="submit" className="sign-in-button">
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}

export default SignIn;
