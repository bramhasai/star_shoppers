import { Col,Button,Form,Card } from "react-bootstrap";
import '../../CSS/seller/AddProduct.css';
import image from '../../assets/image.jpg'
import { useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { authSeller } from "../../firebase";

export default function addProduct(){
    const [productDetails,setProductDetails] = useState({
        title:"",
        description:"",
        price:"",
        discount:"",
        category:"",
        imageUrl:""
    })
    const [error, setError] = useState("");

    const handleAddProduct = async (e) => {
        e.preventDefault();
    
        if (
            !productDetails.title || !productDetails.description || !productDetails.price ||
            !productDetails.discount || !productDetails.category || !productDetails.imageUrl
        ) {
            setError("Please fill in all fields before submitting.");
            return;
        }
    
        if (productDetails.price <= 0) {
            setError("Price must be a positive value.");
            return;
        }
    
        if (productDetails.discount < 0 || productDetails.discount > 100) {
            setError("Discount must be between 0 and 100.");
            return;
        }
    
        onAuthStateChanged(authSeller, async (user) => {
            if (user) {
                try {
                    const res = await axios.post(
                        `http://localhost:3000/seller/${user.uid}/addProducts`,
                        productDetails
                    );
                    alert(res.data.message);
                } catch (error) {
                    console.error("Error adding product:", error);
                    setError("Failed to add product. Please try again.");
                }
            } else {
                navigate('/seller-login');
            }
        });
    };
     

    return(
        <div className="add-product-div">
            <Col className="add-product-col-1">
                <Form className="add_products_form">
                    <Form.Group className="mb-3" controlId="ProductTitle">
                        <Form.Control type="text" placeholder="Product Title"
                             
                            onChange={(e)=>
                                setProductDetails((prevState)=>({
                                    ...prevState,
                                    title:e.target.value
                                }))}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ProductDescription">
                        <Form.Control 
                            as="textarea" 
                            rows={4}
                            placeholder="Product Description"
                            onChange={(e)=>setProductDetails((prevState)=>({
                                ...prevState,
                                description:e.target.value
                            }))}
                        />
                    </Form.Group>

                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"}}>
                        <Form.Group className="mb-3" style={{width:"100%"}} controlId="ProductPrice">
                            <Form.Control type="number" placeholder="Product Price" min='0'
                                onChange={(e)=>setProductDetails((prevState)=>({
                                    ...prevState,
                                    price:e.target.value
                                }))}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" style={{width:"100%"}} controlId="ProductDiscount">
                            <Form.Control type="number" placeholder="Product Discount %" min='0' max='100'
                                onChange={(e)=>setProductDetails((prevState)=>({
                                    ...prevState,
                                    discount:e.target.value
                                }))}
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3" controlId="ProductCategory">
                        <Form.Control type="text" placeholder="Enter Category" 
                            onChange={(e)=>setProductDetails((prevState)=>({
                                ...prevState,
                                category:e.target.value
                            }))}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ProductTitle">
                        <Form.Control type="text" placeholder="Enter Image URL" 
                            onChange={(e)=>setProductDetails((prevState)=>({
                                ...prevState,
                                imageUrl:e.target.value
                            }))}
                        />
                    </Form.Group>

                    <Button variant="success" onClick={handleAddProduct}>Add Product</Button>
                    {error && <p className="error-text" style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                </Form>
            </Col>

            <Col className="add-product-col-2">
                <h4 style={{margin:"0rem", fontWeight:700}}>LIVE PREVIEW</h4>
                <p>This is how, your customers will see your product on the website</p>
                <Card style={{border:"none",width:"40%"}}>
                    <Card.Img style={{height:"80%",width:"80%",display:"flex",alignItems:"center",justifyContent:"center"}} variant="top" src={image} />
                    <Card.Body style={{padding:"1rem 0rem"}}>
                        <Card.Title style={{margin:0}}>{productDetails.title || "Title"}</Card.Title>
                        <Card.Text style={{color:"#3482eb",margin:0,paddingTop:"0.2rem"}}>
                            Price : {productDetails.price? `₹${productDetails.price - (productDetails.discount / 100) * productDetails.price}`: "Price"}{" "}
                            {productDetails.discount ? (
                            <span style={{color:"green"}}>({productDetails.discount}% off)</span>
                            ) : null}
                        </Card.Text>
                        <Card.Text style={{textDecoration:"line-through",margin:0,paddingTop:"0.2rem",paddingBottom:"0.9rem"}}>
                            M.R.P: {productDetails.price}
                        </Card.Text>
                        <Button variant="primary">Add to Cart</Button>
                    </Card.Body>
                </Card>
                
            </Col>
        </div>
    )
}