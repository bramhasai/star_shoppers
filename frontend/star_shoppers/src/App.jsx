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
import AddProduct from "./pages/seller/AddProduct";
import UpdateProduct from "./pages/seller/UpdateProduct";

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

  useEffect(() => {
    const handleAuthCheck = () => {
      let unsubscribe;

      if (location.pathname.startsWith('/seller')) {
        unsubscribe = authSeller.onAuthStateChanged((user) => {
          setSeller(user);
          // Redirect to login only if not authenticated and not on the registration page
          if (!user && location.pathname !== '/seller-register') {
            navigate('/seller-login');
          }
        });
      } else if (location.pathname === '/shopper-home') {
        unsubscribe = authShopper.onAuthStateChanged((user) => {
          setShopper(user);
          // Redirect to login only if not authenticated and not on the registration page
          if (!user && location.pathname !== '/shopper-register') {
            navigate('/shopper-login');
          }
        });
      }

      return unsubscribe;
    };

    const unsubscribe = handleAuthCheck();

    // Cleanup the subscription on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [location.pathname, navigate, setSeller, setShopper]);



  // useEffect(()=>{
  //   const handleAuthCheck = () =>{
  //     if(location.pathname.startsWith('/seller')){
  //       const unsubscribe = authSeller.onAuthStateChanged((user)=>{
  //         setSeller(user);
  //         if(!user){
  //           navigate('/seller-login');
  //         }
  //       })
  //       return unsubscribe;
  //     }
  //     else if(location.pathname === '/shopper-home'){
  //       const unsubscribe = authShopper.onAuthStateChanged((user)=>{
  //         setShopper(user);
  //         if(!user){
  //           navigate('/shopper-login')
  //         }
  //       })
  //       return unsubscribe;
  //     }
  //   }
  //   handleAuthCheck();
  // },[location.pathname,navigate])


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
        <Navbar className="head_navbar">
          <Navbar.Brand className="brand_heading" onClick={()=>navigate(`/seller/home/${seller.uid}`)} style={{cursor:'pointer'}}>
            <img src={Logo} alt="" height={50} width={50}/>
            <h2 style={{margin:0,color:"#4a0072",fontWeight:800}}><i>STAR SELLER'S</i></h2>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            {/* {user && <Button onClick={()=>navigate('/cart')} style={{backgroundColor:"transparent", outline:"none", border:"none"}}>
              <img src={cart_logo}  style={{height:"2.5rem", width:"2.5rem"}} alt="" />
              {Object.keys(cartItems).length>0 && <Badge style={{borderRadius:"50%", marginRight:"1rem"}} bg='success'>{Object.keys(cartItems).length}</Badge>}
            </Button>} */}
            <Button className="logout_button"
              onClick={()=>{
                if(seller){
                  handleLogoutSeller();
                }else{
                  navigate('/seller-login');
                }
              }}
            >
              Logout
            </Button> 
          </Navbar.Collapse>
        </Navbar>
      )}

      {!isShopperAuthPage && isShopperPage  &&(
        <Navbar className="head_navbar">
          <Navbar.Brand className="brand_heading" onClick={()=>navigate('/shopper-home')} style={{cursor:'pointer'}}>
            <img src={Logo} alt="" height={50} width={50}/>
            <h2 style={{margin:0,color:"#4a0072",fontWeight:800}}><i>STAR SHOPPER'S</i></h2>
          </Navbar.Brand>

          <Navbar.Collapse className="justify-content-end">
            <Button className="logout_button"
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
        <Route path="/seller/home/:id" element={<SellerHome />} />
        <Route path="/seller/:id/addProduct" element={<AddProduct />} />
        <Route path="/seller-updateProduct" element={<UpdateProduct />} />
      </Routes>
    </div>
  )
}

export default App
