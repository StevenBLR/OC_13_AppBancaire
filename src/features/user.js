import axios from "axios";
import produce from "immer";
import { serverUrl } from "../data/apiInfos";
import { loginUser } from "../data/userRoutes";
import { selectUser } from "../utils/selectors";

const axInstance = axios.create({
  baseURL: serverUrl,
});

// 1 - Defininiton initialState
const initialState = {
  // 1a - Recois le statut et permet de suivre l'état de la requête
  status: "void",
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

// 4 - Gestion des requetes asynchrones
export async function login(store, email, password) {
  // 4a - Recuperation de l'etat de la requete
  const status = selectUser(store.getState()).status;
  console.log("Status", status);
  console.log("userData =", email, password);
  // 4b - Arret de l'execution si la requete est deja en cours
  if (status === "pending" || status === "updating") {
    return;
  }
  // 4c - Lancement de l'action fetch avec les données user
  store.dispatch(userFetching(email, password));
  try {
    // on utilise fetch pour faire la requête
    axInstance
      .post(`${serverUrl}/user/login`, {
        email,
        password,
      })
      .then((res) => {
        console.log(res);
        const token = res?.data?.body?.token;
        store.dispatch(userResolved(token));
      });
    //const data = await response.json();
    // si la requête fonctionne, on envoie les données à redux avec l'action resolved
    //store.dispatch(userResolved(data));
  } catch (error) {
    // en cas d'erreur on infirme le store avec l'action rejected
    store.dispatch(userRejected(error));
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
        if (draft.status === "void") {
          // on passe en pending
          draft.status = "pending";
          return;
        }
        // si le statut est rejected
        if (draft.status === "rejected") {
          // on supprime l'erreur et on passe en pending
          draft.error = null;
          draft.status = "pending";
          return;
        }
        // si le statut est resolved
        if (draft.status === "resolved") {
          // on passe en updating (requête en cours mais des données sont déjà présentent)
          draft.status = "updating";
          return;
        }
        // sinon l'action est ignorée
        return;
      }
      // si l'action est de type RESOLVED
      case RESOLVED: {
        // si la requête est en cours
        if (draft.status === "pending" || draft.status === "updating") {
          // on passe en resolved et on sauvegarde les données
          draft.token = action.payload;
          draft.status = "resolved";
          return;
        }
        // sinon l'action est ignorée
        return;
      }
      // si l'action est de type REJECTED
      case REJECTED: {
        // si la requête est en cours
        if (draft.status === "pending" || draft.status === "updating") {
          // on passe en rejected, on sauvegarde l'erreur et on supprime les données
          draft.status = "rejected";
          draft.error = action.payload;
          draft.data = null;
          return;
        }
        // sinon l'action est ignorée
        return;
      }
      // Sinon (action invalide ou initialisation)
      default:
        // on ne fait rien (retourne le state sans modifications)
        return;
    }
  });
}
