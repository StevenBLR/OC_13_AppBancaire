import axios from "axios";
import produce from "immer";
import { isExpired } from "react-jwt";
import { serverUrl } from "../utils/apiInfos";
import { getData, setData } from "../utils/localStorage";
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
const LOGOUT = "user/logout";
const SETPROFIL = "user/setProfile";
const LOCALSESSION = "user/resumeLocalSession";

// 3 - Definition des actions
//#region USER ACTIONS
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

export const userSetProfil = (data) => ({
  type: SETPROFIL,
  payload: data,
});
//#endregion

//#region FONCTIONS

/**
 * Gestion du Login User
 * @param {Object} store Store Redux
 * @param {String} email Email entré par user
 * @param {String} password Mot de passe entré par user
 * @returns Promesse contenant la requete de login envoyée au backend
 */
export async function login(store, email, password) {
  // 4a - Recuperation de l'etat de la requete
  const status = selectUser(store.getState()).loginStatus;
  // 4b - Arret de l'execution si la requete est deja en cours
  if (status === "pending" || status === "updating") {
    return;
  }
  // 4c - Lancement de l'action fetch avec les données user
  store.dispatch(userFetching(email, password));
  try {
    return axInstance.post(`${serverUrl}/user/login`, {
      email,
      password,
    });
  } catch (error) {
    // en cas d'erreur on infirme le store avec l'action rejected
    store.dispatch(userRejected(error));
  }
}

/**
 * Gestion du Logout User ( Reset Local storage + Redux state )
 * @param {Object} store Store Redux
 */
export async function logout(store) {
  // Verification du status
  const status = selectUser(store.getState()).loginStatus;
  if (status === "pending" || status === "updating") {
    return;
  }

  // Supprimer le token du local storage
  setData("token", "");
  // MAJ Redux
  store.dispatch(userLogout()); // Action logout inexistante --> State par defaut --> InitialState
}

/**
 * Verification de la presence d'un token ds local storage et MAJ Redux
 * @param {Object} store Store Redux
 * @returns Boolean representant l'etat du login (true = session active / false = session inactive)
 */
export function isLogged(store) {
  // 1 - Verif du state Redux
  let logged = false;
  let token = store.getState().user.token;

  // 2a - Si token indispo via redux --> Verif du local storage
  if (!token) {
    token = getData("token");
    token && console.log("Token retrouvé, reprise de la session");
  }
  // 2b - Token imported via redux
  else logged = true;

  // 3a - Si token existant (redux ou local storage) --> Verif validité token
  if (token) {
    // 4a - Si le token n'as pas expiré --> MAJ Redux avec local token
    if (!isExpired(token)) {
      store.dispatch(resumeLocalSession(token));
      logged = true;
    }
    // 4b - Si le token a expiré --> Return false
    else {
      console.log("Token expiré, reconnectez-vous");
      logged = false;
    }
  }
  return logged;
}

/**
 * Mise a jour du nom/prenom
 * @param {Object} store Store Redux
 * @param {String} firstName Nouveau prenom
 * @param {String} lastName Nouveau nom
 * @returns Promesse contenant la requete de login envoyée au backend
 */
export function updateName(store, firstName, lastName) {
  // 1 - Recuperation du statut login
  const status = selectUser(store.getState()).loginStatus;
  // 2 - Recuperation du token
  const token = selectUser(store.getState()).token;
  // 3 - Arret si statut en attente
  if (status === "pending" || status === "updating") {
    return;
  }
  // 4 - Arret si token expiré
  if (isExpired(token)) {
    console.log("Impossible de modifier le profil, le token a expiré");
    return;
  }
  // 5 - Preparation de l'entete de la requete (ajout token)
  const reqConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  // 6 - Retour de la promesse
  return axInstance
    .put(
      `${serverUrl}/user/profile`,
      {
        firstName: firstName,
        lastName: lastName,
      },
      reqConfig
    )
    .then((res) => {
      store.dispatch(userSetProfil(res?.data?.body));
    });
}

export function getProfil(store) {
  // 1 - Recuperation du token
  const token = selectUser(store.getState()).token;
  // 2 - Arret si token expiré
  if (token && isExpired(token)) {
    console.log("Impossible de recuperer le profil, le token a expiré");
    return;
  }
  // 3 - Preparation de l'entete de la requete (ajout token)
  const reqConfig = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  // 4 - Retour de la promesse
  axInstance.post(`${serverUrl}/user/profile`, {}, reqConfig).then((res) => {
    store.dispatch(userSetProfil(res?.data?.body));
  });
}

//#endregion

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
      case SETPROFIL: {
        if (action.payload) draft.data = action.payload;
        return;
      }
      // Sinon (action invalide ou initialisation)
      default:
        // on ne fait rien (retourne le state sans modifications)
        return;
    }
  });
}
