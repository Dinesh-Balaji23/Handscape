import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import UserLogin from "./Components/UserLogin";
import UserSignup from "./Components/UserSignup";
import SellerLogin from "./Components/SellerLogin";
import SellerSignup from "./Components/SellerSignup";
import AddProduct from "./Components/AddProduct";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Handscape" element={<LandingPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/loginseller" element={<SellerLogin />} />
        <Route path="/signupseller" element={<SellerSignup />} />
        <Route path="/addproduct/:sellername" element={<AddProduct />} />
      </Routes>
    </Router>
  );
};

export default App;