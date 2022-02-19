import axios from "axios";
import produce from "immer";
//import jwt from "jsonwebtoken";
//import { useJwt } from "react-jwt";
import { isExpired, decodeToken } from "react-jwt";
import { serverUrl } from "../data/apiInfos";
import { getData, setData } from "../data/localStorage";
import { loginUser } from "../data/userRoutes";
import { selectUser } from "../utils/selectors";

const axInstance = axios.create({
  baseURL: serverUrl,
});

// 1 - Defininiton initialState
const initialState = {
  // 1a - Recois le statut et permet de suivre l'état de la requête
  loginStatus: "void",
  // 1b - Recois les données lorsque la requête a fonctionné
  data: null,
  // 1c - Recois le token user
  token: null,
  // l'erreur lorsque la requête échoue
  error: null,
};

// 2 - Definition constantes de noms d'actions
const FETCHING = "user/fetching";
const RESOLVED = "user/resolved";
const REJECTED = "user/rejected";
const LOCALSESSION = "user/resumeLocalSession";
const LOGOUT = "user/logout";

// 3 - Definition des actions
// 3a - Action d'envoi de la requete
export const userFetching = (email, password) => ({
  type: FETCHING,
  payload: { email, password },
});

// 3b - Action de reception des données
export const userResolved = (token) => ({
  type: RESOLVED,
  payload: token,
});

// 3c - Action d'erreur
export const userRejected = (error) => ({
  type: REJECTED,
  payload: { error },
});

export const resumeLocalSession = (token) => ({
  type: LOCALSESSION,
  payload: token,
});

export const userLogout = () => ({
  type: LOGOUT,
});

// 4 - Gestion de du Login User
export async function login(store, email, password) {
  // 4a - Recuperation de l'etat de la requete
  const status = selectUser(store.getState()).status;
  // 4b - Arret de l'execution si la requete est deja en cours
  if (status === "pending" || status === "updating") {
    return;
  }
  // 4c - Lancement de l'action fetch avec les données user
  store.dispatch(userFetching(email, password));
  try {
    // on utilise fetch pour faire la requête
    return axInstance.post(`${serverUrl}/user/login`, {
      email,
      password,
    });
    //const data = await response.json();
    // si la requête fonctionne, on envoie les données à redux avec l'action resolved
    //store.dispatch(userResolved(data));
  } catch (error) {
    // en cas d'erreur on infirme le store avec l'action rejected
    store.dispatch(userRejected(error));
  }
}

// X - Gestion du Logout User
export async function logout(store) {
  // Verification du status
  const status = selectUser(store.getState()).status;
  if (status === "pending" || status === "updating") {
    return;
  }

  // Supprimer le token du local storage
  setData("token", "");
  // MAJ Redux
  store.dispatch(userLogout()); // Action logout inexistante --> State par defaut --> InitialState
}

// X - Verification de la presence d'un token ds local storage et MAJ Redux
export function resumeSession(store) {
  // 1 - Recuperation du local storage
  const token = getData("token");
  // 2 - Si le token n'est pas vide
  if (token) {
    // X - Verification du token
    const tokenExpired = isExpired(token);
    // X - Token n'est pas expiré
    if (!tokenExpired) {
      // X - MAJ redux e
      console.log("Token retrouvé, reprise de la session");
      store.dispatch(resumeLocalSession(token));
      return true;
    } else {
      console.log("Token not valid anymore");
      return false;
    }
  }
}

// 5 - Definition du sous reducer "userReducer"
export default function userReducer(state = initialState, action) {
  // On utilise immer pour modifier le state
  return produce(state, (draft) => {
    switch (action.type) {
      // si l'action est de type FETCHING
      case FETCHING: {
        // si le statut est void
        if (draft.loginStatus === "void") {
          // on passe en pending
          draft.loginStatus = "pending";
          return;
        }
        // si le statut est rejected
        if (draft.loginStatus === "rejected") {
          // on supprime l'erreur et on passe en pending
          draft.error = null;
          draft.loginStatus = "pending";
          return;
        }
        // si le statut est resolved
        if (draft.loginStatus === "resolved") {
          // on passe en updating (requête en cours mais des données sont déjà présentent)
          draft.loginStatus = "updating";
          return;
        }
        // sinon l'action est ignorée
        return;
      }
      // si l'action est de type RESOLVED
      case RESOLVED: {
        // si la requête est en cours
        if (
          draft.loginStatus === "pending" ||
          draft.loginStatus === "updating"
        ) {
          // on passe en resolved et on sauvegarde les données
          draft.token = action.payload;
          draft.loginStatus = "resolved";
          return;
        }
        // sinon l'action est ignorée
        return;
      }
      // si l'action est de type REJECTED
      case REJECTED: {
        // si la requête est en cours
        if (
          draft.loginStatus === "pending" ||
          draft.loginStatus === "updating"
        ) {
          // on passe en rejected, on sauvegarde l'erreur et on supprime les données
          draft.loginStatus = "rejected";
          draft.error = action.payload;
          draft.data = null;
          return;
        }
        // sinon l'action est ignorée
        return;
      }
      // si l'action est de type LOCAL SESSION
      case LOCALSESSION: {
        if (action.payload) {
          draft.token = action.payload;
          draft.loginStatus = "resolved";
        }
        return;
      }
      // si l'action est de type LOGOUT --> Reset to initialState
      case LOGOUT: {
        return initialState;
      }
      // Sinon (action invalide ou initialisation)
      default:
        // on ne fait rien (retourne le state sans modifications)
        return;
    }
  });
}
