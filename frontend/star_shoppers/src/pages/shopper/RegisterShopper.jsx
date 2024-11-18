import { Col,Button,Card, Form,NavLink } from "react-bootstrap"
import login2 from '../../assets/login-2.png'
import { useNavigate } from "react-router-dom"
import '../../CSS/seller/RegisterSeller.css'
import { useState } from "react";
import { collection, doc, getDocs, setDoc,query,where } from "firebase/firestore";
import { authShopper, firestoreShopper } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";


export default function RegisterShopper(){
    const navigate = useNavigate();
    const [error,setError] = useState("");

    const handleRegister = async(e)=>{
        e.preventDefault();
        setError("");
        const email = e.target.email.value.trim();
        const phone = e.target.phone.value.trim();
        const password = e.target.password.value.trim();
        const fullname = e.target.fullname.value.trim();

        if (!email || !phone || !password || !fullname) {
            setError("All fields are required.");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            setError("Invalid phone number. Must be exactly 10 digits.");
            return;
        }

        try{
            const phoneQuery = query(collection(firestoreShopper,"shoppers"),where("phone", "==", phone));
            const phoneSnapshot = await getDocs(phoneQuery);
            if (!phoneSnapshot.empty) {
                setError("This phone number is already registered. Please use another number.");
                return;
            }
            const userCredential = await createUserWithEmailAndPassword(authShopper,email,password);
            const shopper = userCredential.user;
            const userDoc = doc(firestoreShopper,"shoppers",shopper.uid);
            await setDoc(userDoc,{
                email,
                phone,
                fullname,
                role:"shopper",
                createdAt:new Date().toISOString(),
            });
            navigate('/shopper-home');
        }catch(error){
            setError(error.message);
        }
    }

    return(
        <div className="register-seller">
            <Col className="register-seller-col-1" style={{height:"100vh",borderRight:"4px solid white"}}>
                <img src={login2} alt="" style={{width:"70%",height:"60%"}}/>
                <Button onClick={()=>navigate('/seller-login')} style={{padding:"0.5rem",width:"40%",backgroundColor:"#e3f2fd",color:"#1565c0",fontWeight:600}} variant="primary">Go to Seller's Login</Button>
            </Col>

            <Col className="register-seller-col-2">
                <Card>
                    <Card.Body style={{color:"#1565c0"}}>
                        <Card.Text>
                            Welcome Shopper! Register and start shopping from your favourite brands. Refer a friend and save 50% OFF.
                        </Card.Text>
                    </Card.Body>
                    <Card.Body style={{width:"100%"}}>
                        <Form onSubmit={handleRegister} style={{display:"flex",flexDirection:"column", gap:"0.5rem",alignItems:"center",justifyContent:"center"}}>
                            
                            <Form.Group style={{width:"100%"}} className="mb-3" controlId="fullname">
                                <Form.Control type="text" placeholder="Enter Fullname" />
                            </Form.Group>

                            <Form.Group style={{width:"100%"}} className="mb-3" controlId="email">
                                <Form.Control type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group style={{width:"100%"}} className="mb-3" controlId="phone">
                                <Form.Control type="tel" placeholder="Enter mobile number" pattern="[0-9]{10}"/>
                            </Form.Group>

                            <Form.Group style={{width:"100%"}} className="mb-3" controlId="password">
                                <Form.Control type="password" placeholder="Enter Password" />
                            </Form.Group>
            
                            <Button variant="primary" type="submit" className="submit"> Submit </Button>
                            {error && <p style={{ color: "red", marginTop: "0.5rem",textAlign:"center" }}>{error}</p>}
                            <div className="Nav_link_button">
                                <Button onClick={()=>navigate('/shopper-login')}>Login</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </div>
    )
}