import React from "react"
import { Col,Button } from "react-bootstrap"
import '../CSS/login_home.css'

import login_1 from '../assets/login-1.png';
import login_2 from '../assets/login-2.png'
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { authSeller,authShopper } from "../firebase";

export default function Login_home(){
    const navigate =useNavigate();

    const handleSellerLogin = () => {
        onAuthStateChanged(authSeller, (user) => {
          if (user) {
            navigate(`/seller/home/${user.uid}`); 
          } else {
            navigate("/seller-login"); 
          }
        });
    };

    const handleShopperLogin = () => {
        onAuthStateChanged(authShopper, (user) => {
          if (user) {
            navigate(`/shopper/home/${user.uid}`); 
          } else {
            navigate("/shopper-login"); 
          }
        });
    };
    return(
        <div className="sign_page">
            <Col className="sign_col-1">
                <img src={login_1} alt="" style={{height:"60%",width:"70%"}}/>
                <Button onClick={handleShopperLogin} 
                    style={{padding:"0.8rem",width:"50%",backgroundColor:"#1565c0",color:"#e3f2fd",fontWeight:600}}>
                        Shoppers Login
                </Button>
            </Col>

            <Col className="sign_col-2">
                <img src={login_2} alt="" style={{height:"60%",width:"70%"}}/>
                <Button onClick={handleSellerLogin}
                    style={{padding:"0.8rem",width:"50%",backgroundColor:"#e3f2fd",color:"#1565c0",fontWeight:600}}>
                        Sellers Login
                </Button>
            </Col>
        </div>
    )
}