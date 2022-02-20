import React, { useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router";
import {
  getProfil,
  isLogged,
  updateName,
  userSetProfil,
} from "../features/user";
import { selectUser, selectUserData } from "../utils/selectors";
import { useDispatch } from "react-redux"; // hook react-redux permettant de lancer une action (run action)
import { useForm } from "react-hook-form";

function User() {
  const [editMode, setEditMode] = useState(false);
  const store = useStore();
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const user = useSelector(selectUser);

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
    defaultValues: {
      firstName: user?.data?.firstName || "Tony",
      lastName: user?.data?.lastName || "Jarvis",
    },
  });

  useEffect(() => {
    // 1 - Si token introuvable ou n'est plus valable --> Redirect vers signin page
    if (!isLogged(store)) navigation("/signin", { replace: false });
  }, [user, navigation, store]);

  useEffect(() => {
    // 2 - Recuperation du profil user
    if (!store.getState().user.data) {
      getUserProfil();
    }
  }, []);

  async function getUserProfil() {
    getProfil(store).then((res) => {
      console.log("User profile", res.data.body);
      store.dispatch(userSetProfil(res?.data?.body));
    });
  }

  async function submitName(userInput) {
    const fname = userInput.firstName;
    const lname = userInput.lastName;
    updateName(store, fname, lname)
      .then((res, err) => {
        console.log(res, err);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <main className="main bg-dark">
      <div className="header">
        <h1>
          Welcome back
          <br />
          {`${user?.data?.firstName ? user.data.firstName : ""} ${
            user?.data?.lastName ? user.data.lastName : ""
          } !`}
        </h1>
        {editMode ? (
          <form className="edit-name-form" onSubmit={handleSubmit(submitName)}>
            <div>
              <input type="text" name="firstname" />
              <input type="text" name="lastname" />
            </div>
            <input type="submit" value="Save" />
            <input
              type="button"
              value="Cancel"
              onClick={() => setEditMode(false)}
            />
          </form>
        ) : (
          <button className="edit-button" onClick={() => setEditMode(true)}>
            Edit Name
          </button>
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  );
}

export default User;
