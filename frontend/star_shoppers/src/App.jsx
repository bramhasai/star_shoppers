import React, { useState,useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route, useNavigate, useLocation } from "react-router-dom";
import Login_home from "./pages/Login_home";

//Shopper
import RegisterShopper from "./pages/shopper/RegisterShopper";
import LoginShopper from "./pages/shopper/LoginShopper";


//seller
import RegisterSeller from "./pages/seller/RegisterSeller";
import LoginSeller from "./pages/seller/LoginSeller";


import { Navbar } from "react-bootstrap";
import Logo from './assets/logo.png'
import SellerHome from "./pages/seller/SellerHome";


function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const isSellerAuthPage = location.pathname === '/seller-login' || location.pathname === '/seller-register';
  const isShopperAuthPage = location.pathname === '/shopper-login' || location.pathname === '/shopper-register';
  const isSellerPage = location.pathname.startsWith('/seller');
  const isShopperPage = location.pathname.startsWith('/shopper');

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div>
      {!isSellerAuthPage && isSellerPage &&(
        <Navbar>
          <Navbar.Brand onClick={()=>navigate('/')} style={{cursor:'pointer'}}>
            <img src={Logo} alt="" height={50} width={50}/>
            <h4><i>STAR SELLER</i></h4>
          </Navbar.Brand>
        </Navbar>
      )}

      {!isShopperAuthPage && isShopperPage  &&(
        <Navbar>
          <Navbar.Brand onClick={()=>navigate('/')} style={{cursor:'pointer'}}>
            <img src={Logo} alt="" height={50} width={50}/>
            <h4><i>STAR SHOPPER</i></h4>
          </Navbar.Brand>
        </Navbar>
      )}
      
      <Routes>
        <Route path="/"  element={<Login_home />} />

        {/* shopper */}
        <Route path="/shopper-register" element={<RegisterShopper />} />
        <Route path="/shopper-login" element={<LoginShopper />} />

        {/* seller */}
        <Route path="/seller-register" element={<RegisterSeller />} />
        <Route path="/seller-login" element={<LoginSeller />} />
        <Route path="/seller-home" element={<SellerHome />} />
      </Routes>
    </div>
  )
}

export default App
