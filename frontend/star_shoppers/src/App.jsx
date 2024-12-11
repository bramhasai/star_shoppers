import React, { useState,useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route, useNavigate, useLocation } from "react-router-dom";
import { Button, Navbar, Badge} from "react-bootstrap";

import Login_home from "./pages/Login_home";
//Shopper
import RegisterShopper from "./pages/shopper/RegisterShopper";
import LoginShopper from "./pages/shopper/LoginShopper";
import ShopperHome from "./pages/shopper/ShopperHome";
import ShopperProducts from "./pages/shopper/ShopperProducts";
import ShopperCart from './pages/shopper/ShopperCart';
import ShopperOrders from  './pages/shopper/ShopperOrders';

//seller
import RegisterSeller from "./pages/seller/RegisterSeller";
import LoginSeller from "./pages/seller/LoginSeller";
import SellerHome from "./pages/seller/SellerHome";
import AddProduct from "./pages/seller/AddProduct";
import UpdateProduct from "./pages/seller/UpdateProduct";

//images
import Logo from './assets/logo.png'
import cart_logo from './assets/cart_logo.png';
import logout from './assets/logout.png';
import userIcon from './assets/userIcon.png';

import { authSeller, authShopper } from "./firebase";
import { signOut } from "firebase/auth";

//App css file
import './App.css';


function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [shopper,setShopper] = useState(null);
  const [seller,setSeller] =  useState(null);
  const [cartItems,setCartItems]=useState(()=>{
    const currentUser = authShopper.currentUser;
    if(currentUser){
      const storedCartItems = localStorage.getItem(`cartItems_${currentUser.uid}`);
      return storedCartItems ? JSON.parse(storedCartItems) : {};
    }
    return {};
  });
  
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
          if (!user && location.pathname !== '/seller-register') {
            navigate('/seller-login');
          }
        });
      } else if (location.pathname.startsWith('/shopper')) {
        unsubscribe = authShopper.onAuthStateChanged((user) => {
          setShopper(user);

          if (user) {
            const storedCartItems = localStorage.getItem(`cartItems_${user.uid}`);
            setCartItems(storedCartItems ? JSON.parse(storedCartItems) : {});
          } else {
            setCartItems({});
          }

          if (!user && location.pathname !== '/shopper-register') {
            navigate('/shopper-login');
          }
        });
      }

      return unsubscribe;
    };
    const unsubscribe = handleAuthCheck();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [location.pathname, navigate, setSeller, setShopper]);


  useEffect(() => {
    const currentUser = authShopper.currentUser;
    if(currentUser){
      localStorage.setItem(`cartItems_${currentUser.uid}`, JSON.stringify(cartItems));
    }
  }, [cartItems]);


  //cart functions
  const handleAddToCart= (item)=>{
    const updateCartItems = {...cartItems, ...item};
    setCartItems(updateCartItems);
  }

  const handleClearCart=()=>{
    setCartItems({});
    const currentUser = authShopper.currentUser;
    if (currentUser) {
      localStorage.removeItem(`cartItems_${currentUser.uid}`);
    }
  }
  

  //logout
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
          <Navbar.Brand className="brand_heading" 
            onClick={()=>navigate(`/seller/home/${seller.uid}`)} 
            style={{cursor:'pointer'}}
          >
            <img src={Logo} alt="" height={50} width={50}/>
            <h2 style={{margin:0,color:"#4a0072",fontWeight:800}}><i>STAR SELLER'S</i></h2>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end" style={{gap:"1.5rem"}}>
            <img src={userIcon} alt='user' 
              onClick={()=>navigate(`/shopper/:${shopper.uid}/cart`)}
              className="user_icon"
            />

            <img src={logout} alt="logout" 
              className="logout"
              onClick={()=>{
                if(seller){
                  handleLogoutSeller();
                }else{
                  navigate('/seller-login');
                }
              }}
            />
          </Navbar.Collapse>
        </Navbar>
      )}

      {!isShopperAuthPage && isShopperPage  &&(
        <Navbar className="head_navbar">
          <Navbar.Brand className="brand_heading" 
            onClick={()=>navigate(`/shopper/home/${shopper.uid}`)} 
            style={{cursor:'pointer'}}
          >
            <img src={Logo} alt="" height={50} width={50}/>
            <h2 style={{margin:0,color:"#4a0072",fontWeight:800}}><i>STAR SHOPPER'S</i></h2>
          </Navbar.Brand>

          <Navbar.Collapse className="justify-content-end" style={{gap:"1.5rem"}}>
            <div className="cart_data">
              <div className="cart-icon-container">
                <img
                  src={cart_logo}
                  alt="cart"
                  onClick={() => navigate(`/shopper/${shopper.uid}/cart`)}
                  className="cart_logo"
                />
                {Object.keys(cartItems).length > 0 && (
                  <div className="cart-badge">
                    {Object.keys(cartItems).length}
                  </div>
                )}
              </div>
            </div>
        
            <img src={userIcon} alt='user' 
              onClick={()=>navigate(`/shopper/${shopper.uid}/products-home`)}
              className="user_icon"
            />

            {/* logout image */}
            <img src={logout} alt="logout" 
              className="logout"
              onClick={() => {
                if (shopper) {
                  handleLogoutShopper();
                } else {
                  navigate("/shopper-login");
                }
              }} 
            />
          </Navbar.Collapse>
        </Navbar>
      )}
      
      <Routes>
        <Route path="/"  element={<Login_home />} />

        {/* shopper */}
        <Route path="/shopper-register" element={<RegisterShopper />} />
        <Route path="/shopper-login" element={<LoginShopper />} />
        <Route path="/shopper/home/:id" element={<ShopperHome />} />
        <Route path="/shopper/:id/products-home" element={<ShopperProducts handleAddToCart={handleAddToCart} cartItems={cartItems}/>}/>
        <Route path="/shopper/:id/cart" element={<ShopperCart handleClearCart={handleClearCart} cartItems={cartItems}/>} />
        <Route path="/shopper/:id/orders" element={<ShopperOrders/>} />
 
        {/* seller */}
        <Route path="/seller-register" element={<RegisterSeller />} />
        <Route path="/seller-login" element={<LoginSeller />} />
        <Route path="/seller/home/:id" element={<SellerHome />} />
        <Route path="/seller/:id/addProduct" element={<AddProduct />} />
        <Route path="/seller/:id/updateProduct/:product_id" element={<UpdateProduct />} />
      </Routes>
    </div>
  )
}

export default App
