import { createStore, combineReducers } from "redux";
import axios from "axios";
import produce from "immer";
import { serverUrl } from "../data/apiInfos";
import { setData } from "../data/localStorage";
import userReducer from "../features/user";

const reducer = combineReducers({
  user: userReducer,
});

const reduxDevtools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

// on utilise le résultat de cette fonction en parametre de createStore
const store = createStore(reducer, reduxDevtools);

export default store;
// const axInstance = axios.create({
//   baseURL: serverUrl,
// });

// const reduxDevtools =
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

// const initialState = {
//   loggedIn: false,
//   user: null,
//   sessionToken: null,
// };

// //#region Actions
// // Fonction qui créee une action (Action Creator)
// export const loginAction = async (email, password) => {
//   /**
//    * Try to log in user with credentials
//    * @param {String} email User email
//    * @param {String} pwd  User password
//    * @returns Promise containing user's token if logged properly
//    */

//   console.log("Action called (login)", email, password);
//   const path = `/user/login`;
//   let message = "";
//   const token = axInstance
//     .post(path, { email, password })
//     .then((res) => {
//       // 1a - Successful request, store the token
//       setData("token", res?.data?.body?.token);
//       message = "Connexion réussie, vous etes maintenant connecté";
//       console.log(message, res);
//     })
//     .catch((error) => {
//       // 1b - Error, display message depening on error
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         message = "Le mot de passe ou l'identifiant est incorrect";
//         console.log(`Error ${error.response.status} - `, message);
//         // console.log(error.response.headers);
//         // console.log(error.response.data);
//       } else if (error.request) {
//         // The request was made but no response was received
//         // `error.request` is an instance of XMLHttpRequest in the
//         // browser and an instance of
//         // http.ClientRequest in node.js
//         message = "Le server ne répond pas";
//         console.log(error.request, message);
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         message = "Il y a un problème au niveau de la requete";
//         console.log("Error", error.message, message);
//       }
//       console.log(error.config);
//     });

//   return {
//     type: "login",
//     payload: token,
//     message: message,
//   };
// };

// // Logout

// //
// //#endregion

// function reducer(state, action) {
//   if (action.type === "login") {
//     let logged = false;
//     console.log("Action payload", action.payload);
//     if (action.payload) logged = true;
//     // Modification du state
//     // 1a - METHODE DESTRUCTURATION (REDUX only)
//     // recreer l'objet (...state) et on modifie un de ses attributs apres la ","
//     // return {
//     //   ...state,               // Copie du state précedent
//     //   loggedIn: logged,       // Modification de du parametre loggedIn
//     // };

//     // 1b - METHODE IMMER (Redux + immer)
//     // Edition du "state" directement, en passant par l'objet immer "draft"
//     return produce(state, (draft) => {
//       draft.loggedIn = true;
//     });
//   }

//   // Reussite --> Enregistrement du token
//   // Echec --> Conservation de l'état par defaut
// }

// //export const store = createStore(reducer, initialState);
// export const store = createStore(reducer, reduxDevtools);

// store.subscribe(() => {
//   console.log(store.getState());
// });
