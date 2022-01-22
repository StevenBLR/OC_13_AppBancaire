import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import App from "./App";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import User from "./pages/User";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/user" element={<User />}></Route>
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>,
  document.querySelector("body")
);
