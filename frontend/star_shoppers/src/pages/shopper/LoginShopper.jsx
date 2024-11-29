import { Col,Button,Card, Form } from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import login2 from '../../assets/login-2.png'
import '../../CSS/seller/LoginSeller.css';
import { useState } from "react";
import { authShopper } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginShopper(){
    const navigate = useNavigate();
    const [error,setError] = useState("");

    const handleShopperLogin = async(e)=>{
        e.preventDefault();
        setError("");
        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();
        try{
            const userCredential =await signInWithEmailAndPassword(authShopper,email,password);
            const shopper =userCredential.user;
            navigate(`/shopper/home/${shopper.uid}`)
        }catch(error){
            setError(error.message);
        }
    }

    return(
        <div className="login-seller" >
            <Col className="login-seller-col-1" style={{height:"100vh",borderRight:"4px solid white"}}>
                <img src={login2} alt="" style={{width:"70%",height:"60%"}} />
                <Button onClick={()=>navigate('/seller-login')} style={{padding:"0.5rem",width:"40%",backgroundColor:"#e3f2fd",color:"#1565c0",fontWeight:600}} variant="primary">Go to Seller's Login</Button>
            </Col>

            <Col className="login-seller-col-2">
                <Card >
                    <Card.Body>
                        <Card.Text style={{color:"#1565c0"}}>
                            Login and start shopping from your favourite brands. Refer a friend and save 50% OFF
                        </Card.Text>
                    </Card.Body>
                    <Card.Body style={{width:"100%"}}>
                        <Form onSubmit={handleShopperLogin} style={{display:"flex",flexDirection:"column", gap:"0.5rem",alignItems:"center",justifyContent:"center"}}>
                            <Form.Group style={{width:"100%"}} className="mb-3" controlId="email">
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group style={{width:"100%"}} className="mb-3" controlId="password">
                                <Form.Control type="password" placeholder="Enter Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="submit"> Submit </Button>

                            {error && <p style={{ color: "red", marginTop: "0.5rem",textAlign:"center" }}>{error}</p>}
                            
                            <div className="Nav_link_button">
                                <Button onClick={()=>navigate('/shopper-register')}>Create Account</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </div>
    )
}