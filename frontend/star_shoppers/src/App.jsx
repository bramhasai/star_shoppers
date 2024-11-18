import React, { useState,useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route, useNavigate, useLocation } from "react-router-dom";
import { Button, Navbar } from "react-bootstrap";

import Login_home from "./pages/Login_home";
//Shopper
import RegisterShopper from "./pages/shopper/RegisterShopper";
import LoginShopper from "./pages/shopper/LoginShopper";
import ShopperHome from "./pages/shopper/ShopperHome";

//seller
import RegisterSeller from "./pages/seller/RegisterSeller";
import LoginSeller from "./pages/seller/LoginSeller";
import SellerHome from "./pages/seller/SellerHome";

//images
import Logo from './assets/logo.png'

import { authSeller, authShopper } from "./firebase";
import { signOut,onAuthStateChanged } from "firebase/auth";

//App css file
import './App.css';


function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const [shopper,setShopper] = useState(null);
  const [seller,setSeller] =  useState(null);
  
  const isSellerAuthPage = location.pathname === '/seller-login' || location.pathname === '/seller-register';
  const isShopperAuthPage = location.pathname === '/shopper-login' || location.pathname === '/shopper-register';
  const isSellerPage = location.pathname.startsWith('/seller');
  const isShopperPage = location.pathname.startsWith('/shopper');



  useEffect(()=>{
    const handleAuthCheck = () =>{
      if(location.pathname === '/seller-home'){
        const unsubscribe = authSeller.onAuthStateChanged((user)=>{
          setSeller(user);
          if(!user){
            navigate('/seller-login');
          }
        })
        return unsubscribe;
      }
      else if(location.pathname === '/shopper-home'){
        const unsubscribe = authShopper.onAuthStateChanged((user)=>{
          setShopper(user);
          if(!user){
            navigate('/shopper-login')
          }
        })
        return unsubscribe;
      }
    }
    handleAuthCheck();
  },[location.pathname,navigate])


  const handleLogoutSeller = async()=>{
    try{
      await signOut(authSeller);
      setSeller(null);
      navigate('/seller-login');
    }
    catch(error){
      console.error("Error logging out seller:", error);
    }
  }

  const handleLogoutShopper = async()=>{
    try{
      await signOut(authShopper);
      setShopper(null);
      navigate('/shopper-login');
    }
    catch(error){
      console.error("Error logging out shopper:", error);
    }
  }

  return (
    <div>
      {!isSellerAuthPage && isSellerPage &&(
        <Navbar className="seller-navbar">
          <Navbar.Brand className="seller-heading" onClick={()=>navigate('/seller-home')} style={{cursor:'pointer'}}>
            <img src={Logo} alt="" height={50} width={50}/>
            <h3 style={{margin:0}}><i>STAR SELLER'S</i></h3>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            {/* {user && <Button onClick={()=>navigate('/cart')} style={{backgroundColor:"transparent", outline:"none", border:"none"}}>
              <img src={cart_logo}  style={{height:"2.5rem", width:"2.5rem"}} alt="" />
              {Object.keys(cartItems).length>0 && <Badge style={{borderRadius:"50%", marginRight:"1rem"}} bg='success'>{Object.keys(cartItems).length}</Badge>}
            </Button>} */}
            <Button 
              onClick={()=>{
                if(seller){
                  handleLogoutSeller();
                }else{
                  navigate('/seller-login');
                }
              }}
            >
              {seller?"Logout":"Login"}
            </Button> 
          </Navbar.Collapse>
        </Navbar>
      )}

      {!isShopperAuthPage && isShopperPage  &&(
        <Navbar>
          <Navbar.Brand onClick={()=>navigate('/shopper-home')} style={{cursor:'pointer'}}>
            <img src={Logo} alt="" height={50} width={50}/>
            <h3><i>STAR SHOPPER'S</i></h3>
          </Navbar.Brand>

          <Navbar.Collapse className="justify-content-end">
            <Button
              onClick={() => {
                if (shopper) {
                  handleLogoutShopper();
                } else {
                  navigate("/shopper-login");
                }
              }}
            >
              {shopper ? "Logout" : "Login"}
            </Button>
          </Navbar.Collapse>
        </Navbar>
      )}
      
      <Routes>
        <Route path="/"  element={<Login_home />} />

        {/* shopper */}
        <Route path="/shopper-register" element={<RegisterShopper />} />
        <Route path="/shopper-login" element={<LoginShopper />} />
        <Route path="/shopper-home" element={<ShopperHome />} />

        {/* seller */}
        <Route path="/seller-register" element={<RegisterSeller />} />
        <Route path="/seller-login" element={<LoginSeller />} />
        <Route path="/seller-home" element={<SellerHome />} />
      </Routes>
    </div>
  )
}

export default App
