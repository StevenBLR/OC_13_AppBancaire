import { createStore } from "@reduxjs/toolkit";
import axios from "axios";
import { serverUrl } from "./apiInfos";
import { setData } from "./localStorage";

const axInstance = axios.create({
  baseURL: serverUrl,
});

const initialState = {
  loggedIn: false,
  user: null,
  sessionToken: null,
};

//#region Actions
// Fonction qui créee une action (Action Creator)
export const loginAction = (email, pwd) => {
  /**
   * Try to log in user with credentials
   * @param {String} email User email
   * @param {String} pwd  User password
   * @returns Promise containing user's token if logged properly
   */

  console.log("Action called (login)", email, pwd);
  const path = `/user/login`;
  const token = axInstance.post(path, { email, pwd })?.data?.token;
  setData("token", token);

  return {
    type: "login",
    payload: token,
  };
};

// Logout

//
//#endregion

function reducer(state, action) {
  if (action.type === "login") {
    // MAJ le state selon
    let logged = false;
    if (action.payload) logged = true;
    // Retour du state modifié

    // recreer l'objet (...state) et on modifie un de ses attributs apres la ","
    return {
      ...state,
      loggedIn: logged,
    };

    // Reussite --> Enregistrement du token
    // Echec --> Conservation de l'état par defaut
  }
}

export const store = createStore(reducer, initialState);
