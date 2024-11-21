import { Col,Button } from "react-bootstrap";
import '../../CSS/seller/SellerHome.css'
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { authSeller } from "../../firebase";


function SellerHome(){
    const navigate =  useNavigate();

    const handleAddProduct = ()=>{
        onAuthStateChanged(authSeller,(user)=>{
            if(user){
                navigate(`/seller/${user.uid}/addProduct`)
            }
            else{
                navigate('/seller-login')
            }
        })
    }

    return(
        <div className="seller-home-div">
            <Col className="seller-home-col-1">
                <h4 style={{margin:0,fontWeight:700,fontSize:"1.5rem"}}>SALES PERFORMANCE</h4>
            </Col>

            <Col className="seller-home-col-2">
                <div className="my_products">
                    <h4 style={{margin:0,fontWeight:700,fontSize:"1.5rem"}}>YOUR PRODUCTS</h4>
                    <Button onClick={handleAddProduct}>Add New Product</Button>
                </div>     
            </Col>
        </div>
    )
}

export default SellerHome;