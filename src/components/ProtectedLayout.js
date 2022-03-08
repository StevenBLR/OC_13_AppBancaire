import React, { useEffect } from "react";
import { useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router";
import { isLogged } from "../features/user";
import { selectUser } from "../utils/selectors";

// childre fait reference aux sous composants encapsules
function ProtectedLayout({ children }) {
  const store = useStore();
  const navigation = useNavigate();
  const user = useSelector(selectUser); // TODO - Censé subscribe l'etat du state

  useEffect(() => {
    // 1 - Si token introuvable ou n'est plus valable --> Redirect vers signin page
    if (!isLogged(store)) navigation("/signin");
  }, [user, navigation, store]);

  return <div>{children}</div>;
}

export default ProtectedLayout;
