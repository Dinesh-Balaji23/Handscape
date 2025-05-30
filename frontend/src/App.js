import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import UserLogin from "./Components/UserLogin";
import UserSignup from "./Components/UserSignup";
import SellerLogin from "./Components/SellerLogin";
import SellerSignup from "./Components/SellerSignup";
import AddProduct from "./Components/AddProduct";
import UserDashboard from "./Components/UserDashboard";
import ProductList from "./Components/ProductList";
import ViewProduct from "./Components/ViewProduct";
import Cart from "./Components/Cart";
import UserOrder from "./Components/UserOrder";
import SellerDashboard from "./Components/SellerDashboard";
import SellerOrders from "./Components/SellerOrders";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/loginseller" element={<SellerLogin />} />
        <Route path="/signupseller" element={<SellerSignup />} />
        <Route path="/addproduct/:sellername" element={<AddProduct />} />
        <Route path="/user-dashboard/:username" element={<UserDashboard />} />
        <Route path="/products/:username" element={<ProductList />} />
        <Route path="/viewprod/:username/:id" element={<ViewProduct />} />
        <Route path="/cart/:username" element={<Cart />} />
        <Route path="/orders/:username" element={<UserOrder />} />
        <Route path="/seller-dashboard/:sellername" element={<SellerDashboard />} />
        <Route path="/seller-orders/:sellername" element={<SellerOrders />} />
      </Routes>
    </Router>
  );
};

export default App;