import axios from "axios";
import { serverUrl } from "./apiInfos";

const axInstance = axios.create({
  baseURL: serverUrl,
});

/**
 * Try to log in user with credentials
 * @param {String} email User email
 * @param {String} pwd  User password
 * @returns Promise containing user's token if logged properly
 */
export function loginUser(email, pwd) {
  const path = `/user/login`;
  return axInstance.post(path, { email, pwd });
}

/**
 * Try to sign up user
 * @param {String} email User email
 * @param {String} pwd  User password
 * @param {String} firstName User firstName
 * @param {String} lastName  User lastName
 * @returns Promise containing user's sign up infos
 */
export function signupUser(email, pwd, firstName, lastName) {
  const path = `/user/signup`;
  return axInstance.post(path, { email, pwd, firstName, lastName });
}

/**
 * Fetch User's profile infos
 * @param {String} userToken User token
 * @returns Promise containing user's datas
 */
export function getUserProfil(userToken) {
  const config = {
    headers: { Authorization: `Bearer ${userToken}` },
  };
  const path = `/user/profile`;
  return axInstance.post(path, config);
}

/**
 * Update User's profile infos
 * @param {String} userToken User token
 * @param {String} firstName User firstName to update
 * @param {String} lastName  User lastName to update
 * @returns Promise containing profil update status
 */
export function updateUserProfil(userToken, firstName, lastName) {
  const config = {
    headers: { Authorization: `Bearer ${userToken}` },
  };
  const path = `/user/profile`;
  return axInstance.put(path, config, { firstName, lastName });
}
