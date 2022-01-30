import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import User from "./pages/User";
import { store } from "./data/redux";
import { Provider, useDispatch } from "react-redux";

function App() {
  useEffect(() => {
    // Get redux state
    const state = store.getState();
    console.log(state);
  }, []);

  return (
    <Router>
      <Provider store={store}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/user" element={<User />}></Route>
        </Routes>
        <Footer />
      </Provider>
    </Router>
  );
}

export default App;
