import React, { useEffect } from "react";
import { useForm } from "react-hook-form"; // hook permettant de recuperer facilement le contenu d'un formulaire
import { useSelector, useStore } from "react-redux"; // hook react-redux permettant de lire le state redux
import { useDispatch } from "react-redux"; // hook react-redux permettant de lancer une action (run action)
import { useNavigate } from "react-router"; // hook utilisé pour faire une redirection
import { setData } from "../data/localStorage";
import {
  login,
  resumeSession,
  userRejected,
  userResolved,
} from "../features/user";

function SignIn() {
  // On recupere le store grace au hook useStore()
  const store = useStore();
  const minLength = 1;
  const navigation = useNavigate();
  /** Parametrage hook form
   *
   * @param {Function} register Connect any input to hook form system
   * @param {Function} handleSubmit Called when submit function is called on form
   * @param {Object} formState Used to handle errors
   * Documentation : https://react-hook-form.com/get-started/#Quickstart
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   userName: "user@mail.com",
    // },
  });

  useEffect(() => {
    if (resumeSession(store)) navigation("/user", { replace: false });
  }, [navigation]);

  // Login with user credentials (Clic sur bt Login)
  const loginUser = async (userInput) => {
    console.log("User inputs", userInput);
    // 1 - On appele la fonction login (feature/user)
    login(store, userInput.username, userInput.password)
      // 2a - Si la requete OK -->
      // Dispatch & stockage du token ds le local storage puis redirect vers page user
      .then((res) => {
        const token = res?.data?.body?.token;
        setData("token", token); // Store token to local storage
        navigation("/user", { replace: false });
        store.dispatch(userResolved(token));
      })
      // 2b - Si la requete not ok -->
      // Dispatch de l'erreur
      .catch((err) => {
        // en cas d'erreur on infirme le store avec l'action rejected
        store.dispatch(userRejected(err));
      });
  };

  return (
    <main className="main bg-dark">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        {/* On submit, on appelle fct react hook et ensuite ma fct onSubmit */}
        <form onSubmit={handleSubmit(loginUser)}>
          <div className="input-wrapper">
            <label for="username">Username</label>
            <input
              {...register("username", {
                required: "Ce champ est obligatoire",
                minLength: {
                  value: minLength,
                  message: `La taille minimum est de ${minLength} caractères`,
                },
              })}
              type="text"
              id="username"
            />
          </div>
          {/* Show userName error message if available (from hook form) */}
          <p>{errors.userName?.message}</p>
          <div className="input-wrapper">
            <label for="password">Password</label>
            <input
              {...register("password", {
                required: "Ce champ est obligatoire",
                minLength: {
                  value: minLength,
                  message: `La taille minimum est de ${minLength} caractères`,
                },
              })}
              type="password"
              id="password"
            />
          </div>
          {/* Show password error message if available (from hook form) */}
          <p>{errors.password?.message}</p>
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

// function SignIn() {
//   // On recupere le store grace au hook useStore()
//   const store = useStore();
//   const navigation = useNavigate();
//   //const dispatch = useDispatch(); // On utilise le hook useDispatch dans notre composant

//   //const userLogged = useSelector((state) => state.loggedIn); // On stock l'état de notre substate "logged in"
//   const minLength = 4;

//   /**
//    * Parametrage hook form
//    * @param {Function} register Connect any input to hook form system
//    * @param {Function} handleSubmit Called when submit function is called on form
//    * @param {Object} formState Used to handle errors
//    * Documentation : https://react-hook-form.com/get-started/#Quickstart
//    */
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     // defaultValues: {
//     //   userName: "user@mail.com",
//     // },
//   });

//   console.log("Hook form status", errors);

//   // Login with user credentials
//   const onSubmit = (userInput) => {
//     console.log(userInput);
//     // On excecute la fonction dispatch avec une action
//     dispatch(loginAction(userInput.userName, userInput.password));
//   };
//   // if (userLogged) {
//   //   console.log("User Logged (Signin page)");
//   // }

//   // Redirect user to previous page if he is already logged in
//   // useEffect(() => {
//   //   if (!userLogged) {
//   //     navigation(-1); // Go back to previous page
//   //   }
//   // }, [userLogged, navigation]);

//   return (
//     <main className="main bg-dark">
//       <section className="sign-in-content">
//         <i className="fa fa-user-circle sign-in-icon"></i>
//         <h1>Sign In</h1>
//         {/* On submit, on appelle fct react hook et ensuite ma fct onSubmit */}
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="input-wrapper">
//             <label for="username">Username</label>
//             <input
//               {...register("userName", {
//                 required: "Ce champ est obligatoire",
//                 minLength: {
//                   value: minLength,
//                   message: `La taille minimum est de ${minLength} caractères`,
//                 },
//               })}
//               type="text"
//               id="username"
//             />
//           </div>
//           {/* Show userName error message if available (from hook form) */}
//           <p>{errors.userName?.message}</p>
//           <div className="input-wrapper">
//             <label for="password">Password</label>
//             <input
//               {...register("password", {
//                 required: "Ce champ est obligatoire",
//                 minLength: {
//                   value: minLength,
//                   message: `La taille minimum est de ${minLength} caractères`,
//                 },
//               })}
//               type="password"
//               id="password"
//             />
//           </div>
//           {/* Show password error message if available (from hook form) */}
//           <p>{errors.password?.message}</p>
//           <div className="input-remember">
//             <input
//               {...register("remember-me")}
//               type="checkbox"
//               id="remember-me"
//             />
//             <label for="remember-me">Remember me</label>
//           </div>
//           {/* <!-- PLACEHOLDER DUE TO STATIC SITE --> */}

//           {/* <!-- SHOULD BE THE BUTTON BELOW --> */}
//           {/* Utiliser react hook form pour recuprerer les values dui form */}
//           <button type="submit" className="sign-in-button">
//             Sign In
//           </button>
//         </form>
//       </section>
//     </main>
//   );
// }

// export default SignIn;
