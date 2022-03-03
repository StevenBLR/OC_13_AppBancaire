import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import User from "./pages/User";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/user" element={<User />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
