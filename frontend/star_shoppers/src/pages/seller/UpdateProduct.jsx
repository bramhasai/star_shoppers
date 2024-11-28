import { Col,Button,Form,Card } from "react-bootstrap";
import '../../CSS/seller/UpdateProduct.css';
import img_default from '../../assets/image.jpg'
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authSeller } from "../../firebase";
import axios from "axios";
export default function UpdateProduct(){
    const  location = useLocation();
    const ProductDetails = location.state;
    const navigate = useNavigate();

    const [updateProductDetails, setUpdateProductDetails] = useState({
        title: ProductDetails.title,
        description: ProductDetails.description,
        price: ProductDetails.price,
        discount: ProductDetails.discount,
        category: ProductDetails.category,
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(
        ProductDetails.image || require('../../assets/image.jpg')
    );

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () =>{
                setPreviewImage(reader.result);
            }
            reader.readAsDataURL(file);
            setImage(file);
        }
    }
    const user =authSeller.currentUser;
    // const handleUpdate = async()=>{
    //     await axios.put(`http://localhost:3000/seller/${user.uid}/updateProduct/${ProductDetails._id}`,updateProductDetails);
    //     alert("Product updated")
    //     navigate(`/seller/home/${user.uid}`)
    // }

    const handleUpdate = async () => {
        // const user = authSeller.currentUser;
        
        if (!user) {
            alert("User not authenticated. Redirecting to Login ..");
            navigate('/seller-login');
            return;
        }

        try {
            // Create FormData to send file and other data
            const formData = new FormData();
            formData.append('title', updateProductDetails.title);
            formData.append('description', updateProductDetails.description);
            formData.append('price', updateProductDetails.price);
            formData.append('discount', updateProductDetails.discount);
            formData.append('category', updateProductDetails.category);
            
            // Only append image if a new image is selected
            if (image) {
                formData.append('image', image);
            }

            const res = await axios.put(
                `http://localhost:3000/seller/${user.uid}/updateProduct/${ProductDetails._id}`, 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            alert(res.data.message);
            navigate(`/seller/home/${user.uid}`);
        } catch (error) {
            console.error("Error updating product:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to update product");
        }
    };

    return(
        <div className="update-product-div">
            <Col className="update-product-col-1">
                <Form className="update_products_form">
                    <Form.Group className="mb-3" controlId="ProductTitle">
                        <Form.Control type="text"  placeholder="Product Title" 
                            value={updateProductDetails.title}
                            onChange={(e)=>setUpdateProductDetails((prevState)=>({
                                ...prevState,
                                title:e.target.value
                            }))}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ProductDescription">
                        <Form.Control 
                            as="textarea" 
                            rows={4}
                            placeholder="Product Description"
                            value={updateProductDetails.description}
                            onChange={(e)=>setUpdateProductDetails((prevState)=>({
                                ...prevState,
                                description:e.target.value
                            }))}
                        />
                    </Form.Group>

                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"}}>
                        <Form.Group className="mb-3" style={{width:"100%"}} controlId="ProductPrice">
                            <Form.Control type="number" placeholder="Product Price" min='0'
                                value={updateProductDetails.price}
                                onChange={(e)=>setUpdateProductDetails((prevState)=>({
                                    ...prevState,
                                    price: Math.max(0, Number(e.target.value))
                                }))}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" style={{width:"100%"}} controlId="ProductDiscount">
                            <Form.Control type="number" placeholder="Product Discount %"  min='0' max='100'
                                value={updateProductDetails.discount}
                                onChange={(e)=>setUpdateProductDetails((prevState)=>({
                                    ...prevState,
                                    discount: Math.min(100, Math.max(0, Number(e.target.value)))
                                }))}
                            />
                        </Form.Group>
                    </div>

                    {/* <Form.Group className="mb-3" controlId="ProductCategory">
                        <Form.Control type="text" placeholder="Enter Category" 
                            value={updateProductDetails.category}
                            onChange={(e)=>setUpdateProductDetails((prevState)=>({
                                ...prevState,
                                category:e.target.value
                            }))}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ProductTitle">
                        <Form.Control type="text" placeholder="Enter Image URL" 
                            value={updateProductDetails.imageUrl}
                            onChange={(e)=>setUpdateProductDetails((prevState)=>({
                                ...prevState,
                                imageUrl:e.target.value
                            }))}
                        />
                    </Form.Group> */}

                    <Form.Group className="mb-3" controlId="ProductCategory">
                        <Form.Select
                            value={updateProductDetails.category}
                            onChange={(e) => setUpdateProductDetails((prevState) => ({
                                ...prevState,
                                category: e.target.value
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
                        <option value="Jewelry & Watches">Jewelry & Watches</option>
                        <option value="Food & Beverages">Food & Beverages</option>
                        <option value="Baby Products">Baby Products</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="others">others</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ProductImage">
                        <Form.Control 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Form.Group>
                
                    <Button variant="success" onClick={handleUpdate}>Update Product</Button>
                </Form>
            </Col>  

            <Col className="update-product-col-2">
            <h4 style={{margin:"0rem", fontWeight:700}}>LIVE PREVIEW</h4>
                <p>This is how, your customers will see your product on the website</p>
                <Card style={{border:"none",width:"40%"}}>
                    <Card.Img 
                        style={{height:"80%",width:"80%",display:"flex",alignItems:"center",justifyContent:"center"}} 
                        variant="top" 
                        src={previewImage} 
                    />
                    <Card.Body style={{padding:"1rem 0rem"}}>
                        <Card.Title style={{margin:0}}>{updateProductDetails.title || "Title"}</Card.Title>
                        <Card.Text style={{color:"#3482eb",margin:0,paddingTop:"0.2rem"}}>
                            Price : {updateProductDetails.price? `₹${updateProductDetails.price - (updateProductDetails.discount / 100) * updateProductDetails.price}`: "Price"}{" "}
                            {updateProductDetails.discount ? (
                            <span style={{color:"green"}}>({updateProductDetails.discount}% off)</span>
                            ) : null}
                        </Card.Text>
                        <Card.Text style={{textDecoration:"line-through",margin:0,paddingTop:"0.2rem",paddingBottom:"0.9rem"}}>
                            M.R.P: {updateProductDetails.price}
                        </Card.Text>
                        <Button variant="primary">Add to Cart</Button>
                    </Card.Body>
                </Card>
            </Col>
        </div>
    )
}