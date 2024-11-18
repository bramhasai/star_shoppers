import React from "react";
import { Col,Button,Card, Form } from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import login1 from '../../assets/login-1.png'
import '../../CSS/seller/LoginSeller.css';
import { authSeller } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function LoginSeller(){
    const navigate = useNavigate();
    const [error,setError]=useState("");

    const handleLogin = async(e)=>{
        e.preventDefault();
        setError("");
        const email = e.target.email.value.trim();
        const password = e.target.password.value;
        try{
            const userCredential = await signInWithEmailAndPassword(authSeller,email,password);
            const seller = userCredential.user;
            navigate('/seller-home');
        }catch(err){
            setError(err.message);
        }
    }
    return(
        <div className="login-seller" >
            <Col className="login-seller-col-1" style={{height:"100vh",borderRight:"4px solid white"}}>
                <img src={login1} alt="" style={{width:"60%",height:"60%"}} />
                <Button onClick={()=>navigate('/shopper-login')} style={{padding:"0.5rem",width:"40%",backgroundColor:"#e3f2fd",color:"#1565c0",fontWeight:600}} variant="primary">Go to Shopper's Login</Button>
            </Col>

            <Col className="login-seller-col-2">
                <Card >
                    <Card.Body>
                        <Card.Text style={{color:"#1565c0"}}>
                            Welcome Sellers! Log in to manage your inventory, process orders, and boost your sales effortlessly.
                        </Card.Text>
                    </Card.Body>
                    <Card.Body style={{width:"100%"}}>
                        <Form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column", gap:"0.5rem",alignItems:"center",justifyContent:"center"}}>
                            <Form.Group style={{width:"100%"}} className="mb-3" controlId="email">
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group style={{width:"100%"}} className="mb-3" controlId="password">
                                <Form.Control type="password" placeholder="Enter Password" />
                            </Form.Group>
                            {/* <h6>OR</h6>
                            <Form.Group style={{width:"100%"}} className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="tel" placeholder="Enter mobile number" pattern="[0-9]{10}" />
                            </Form.Group> */}
                            <Button variant="primary" type="submit" className="submit"> Submit </Button>
                            {error && <p style={{ color: "red", marginTop: "0.5rem",textAlign:"center" }}>{error}</p>}
                            <div className="Nav_link_button">
                                <Button onClick={()=>navigate('/seller-register')}>Create Account</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </div>
    )
}