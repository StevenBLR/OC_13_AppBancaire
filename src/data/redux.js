import { createStore } from "@reduxjs/toolkit";
import axios from "axios";
import { serverUrl } from "./apiInfos";

const axInstance = axios.create({
  baseURL: serverUrl,
});

const initialState = {
  loggedIn: false,
  user: null,
  sessionToken: null,
};

// Fonction qui créee une action (Action Creator)
export const loginAction = (email, pwd) => ({
  type: "login",
  payload: { email: email, password: pwd },
});

function reducer(state, action) {
  if (action.type === "login") {
    // Tentative de connexion

    /**
     * Try to log in user with credentials
     * @param {String} email User email
     * @param {String} pwd  User password
     * @returns Promise containing user's token if logged properly
     */

    function loginUser(email, pwd) {
      const path = `/user/login`;
      return axInstance.post(path, { email, pwd });
    }

    loginUser(action.payload.email, action.payload.password).then((res) => {
      console.log(res);
    });

    return {
      ...state,
    };

    // Reussite --> Enregistrement du token
    // Echec --> Conservation de l'état par defaut
  }
}

export const store = createStore(reducer, initialState);
