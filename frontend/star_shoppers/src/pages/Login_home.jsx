import React from "react"
import { Col,Button } from "react-bootstrap"
import '../CSS/login_home.css'

import login_1 from '../assets/login-1.png';
import login_2 from '../assets/login-2.png'
import { useNavigate } from "react-router-dom";

export default function Login_home(){
    const navigate =useNavigate();
    return(
        <div className="sign_page">
            <Col className="sign_col-1">
                <img src={login_1} alt="" style={{height:"60%",width:"70%"}}/>
                <Button onClick={()=>navigate('/shopper-login')} 
                    style={{padding:"0.8rem",width:"50%",backgroundColor:"#1565c0",color:"#e3f2fd",fontWeight:600}}>
                        Shoppers Login
                </Button>
            </Col>

            <Col className="sign_col-2">
                <img src={login_2} alt="" style={{height:"60%",width:"70%"}}/>
                <Button onClick={()=>navigate('/seller-login')}
                    style={{padding:"0.8rem",width:"50%",backgroundColor:"#e3f2fd",color:"#1565c0",fontWeight:600}}>
                        Sellers Login
                </Button>
            </Col>
        </div>
    )
}