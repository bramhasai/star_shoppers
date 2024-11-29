import { Col,Button,Form,Card } from "react-bootstrap";
import '../../CSS/seller/AddProduct.css';
import image from '../../assets/image.jpg'
import { useState } from "react";
import axios from "axios";
import { authSeller } from "../../firebase";
import {useNavigate} from "react-router-dom"

export default function addProduct(){
    const navigate = useNavigate();
    const [productDetails,setProductDetails] = useState({
        title:"",
        description:"",
        price:"",
        discount:"",
        category:"",
    })
    const [error, setError] = useState("");
    const [image,setImage] = useState(null);
    const [previewImage,setPreviewImage] = useState(null);

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = ()=>{
                setPreviewImage(reader.result);
            }
            reader.readAsDataURL(file);
            setImage(file);
        }
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (
            !productDetails.title || !productDetails.description || !productDetails.price ||
            !productDetails.discount || !productDetails.category || !image
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

        const user = authSeller.currentUser;

        if(!user){
            alert("User not authenticated. Redirecting to Login ..");
            navigate('/seller-login');
            return;
        }
        try{
            const formData = new FormData();
            formData.append('title',productDetails.title);
            formData.append('description',productDetails.description);
            formData.append('price', productDetails.price);
            formData.append('discount', productDetails.discount);
            formData.append('category', productDetails.category);
            formData.append('image', image);
            const res = await axios.post(
                `http://localhost:3000/seller/${user.uid}/addProducts`, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            //const res =await axios.post(`http://localhost:3000/seller/${user.uid}/addProducts`,productDetails);
            alert(res.data.message);
            setProductDetails({
                title:"",
                description:"",
                price: "",
                discount: "",
                category: ""
            })
            setImage(null);
            setPreviewImage(null);
            navigate(`/seller/home/${user.uid}`)
        }catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to add product. Please try again.");
        }
    };
     

    return(
        <div className="add-product-div">
            <Col className="add-product-col-1">
                <Form className="add_products_form">
                    <Form.Group className="mb-3" controlId="ProductTitle">
                        <Form.Control type="text" placeholder="Product Title"
                            value={productDetails.title} 
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
                            value={productDetails.description}
                            onChange={(e)=>setProductDetails((prevState)=>({
                                ...prevState,
                                description:e.target.value
                            }))}
                        />
                    </Form.Group>

                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"}}>
                        <Form.Group className="mb-3" style={{width:"100%"}} controlId="ProductPrice">
                            <Form.Control type="number" placeholder="Product Price" min='0'
                                value={productDetails.price}
                                onChange={(e)=>setProductDetails((prevState)=>({
                                    ...prevState,
                                    price: Math.max(0, Number(e.target.value))
                                }))}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" style={{width:"100%"}} controlId="ProductDiscount">
                            <Form.Control type="number" placeholder="Product Discount %" min='0' max='100'
                                value={productDetails.discount}
                                onChange={(e)=>setProductDetails((prevState)=>({
                                    ...prevState,
                                    discount: Math.min(100, Math.max(0, Number(e.target.value)))
                                }))}
                            />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3" controlId="ProductCategory">
                        <Form.Select
                            value={productDetails.category}
                            onChange={(e)=>setProductDetails((prevState)=>({
                                ...prevState,
                                category:e.target.value
                            }))}
                        >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home-Appliances">Home-Appliances</option>
                        <option value="Books">Books</option>
                        <option value="Sports & Outdoors">Sports & Outdoors</option>
                        <option value="Health & Beauty">Health & Beauty</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Automotive">Automotive</option>
                        <option value="jewelley & Watches">jewelley & Watches</option>
                        <option value="Food & Beverages">Food & Beverages</option>
                        <option value="Baby Products">Baby Products</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="others">others</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ProductTitle">
                        <Form.Control type="file" placeholder="Select Image" 
                            accept="image/*"
                            onChange={handleImageChange}
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
                    <Card.Img 
                        style={{height:"80%",width:"80%",display:"flex",alignItems:"center",justifyContent:"center"}} 
                        variant="top" 
                        src={previewImage || image} />
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