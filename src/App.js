import "./App.css";
//import { BrowserRouter as Router, Link, Switch } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import User from "./pages/User";

function App() {
  return (
    <div className="app">
      <Header />
      {/* <Home/>
      <SignIn/> */}
      <User />
      <Footer />
    </div>
  );
}

export default App;
