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
import { useForm } from "react-hook-form";
import ProtectedLayout from "../components/ProtectedLayout";

function User() {
  const [editMode, setEditMode] = useState(false); // Parametrage hook form
  const { register, handleSubmit } = useForm();
  const store = useStore();
  const navigation = useNavigate();
  const user = useSelector(selectUser); // TODO - Censé subscribe l'etat du state

  console.log("User =", user);

  useEffect(() => {
    // 2 - Recuperation du profil user
    if (!store.getState().user.data) {
      // X - Maj redux via user.js ( recup infos user )
      getProfil(store);
    }
  }, []);

  async function submitName(userInput) {
    const fname = userInput.firstName;
    const lname = userInput.lastName;
    // 1 - Use user sub reducer fonction updateName
    updateName(store, fname, lname);
    // 2 - Disable edit mode after validation
    setEditMode(false);
  }

  return (
    <ProtectedLayout>
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
            <form
              className="edit-name-form"
              onSubmit={handleSubmit(submitName)}
            >
              <div>
                <input
                  {...register("firstName")}
                  className="edit-name-form__text-field"
                  type="text"
                  name="firstName"
                  placeholder={
                    user?.data?.firstName ? user.data.firstName : "firstName"
                  }
                />
                <input
                  {...register("lastName")}
                  className="edit-name-form__text-field"
                  type="text"
                  name="lastName"
                  placeholder={
                    user?.data?.lastName ? user.data.lastName : "lastName"
                  }
                />
              </div>
              <input
                className="edit-name-form__bt"
                type="submit"
                value="Save"
                onSubmit={() => setEditMode(false)}
              />
              <input
                className="edit-name-form__bt"
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
    </ProtectedLayout>
  );
}

export default User;
