import { Col, Button, Card, Spinner } from "react-bootstrap";
import '../../CSS/seller/SellerHome.css';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { authSeller } from "../../firebase";
import { useEffect, useState } from "react";
import axios from "axios";

function SellerHome() {
    const navigate = useNavigate();
    const [myProducts, setMyProducts] = useState([]);
    const [myUser, setMyUser] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authSeller, (user) => {
            if (user) {
                setMyUser(user);
                const fetchMyProducts = async () => {
                    try {
                        setLoading(true); // Start loading
                        const results = await axios.get(`http://localhost:3000/seller/home/${user.uid}`);
                        setMyProducts(results.data.data);
                    } catch (error) {
                        console.error("Error fetching products:", error.message || error);
                        alert("Failed to fetch products. Please try again.");
                    } finally {
                        setLoading(false); // Stop loading
                    }
                };
                fetchMyProducts();
            } else {
                navigate('/seller-login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleAddProduct = () => {
        const user = authSeller.currentUser;
        if (user) {
            navigate(`/seller/${user.uid}/addProduct`);
        } else {
            navigate('/seller-login');
        }
    };

    const updateProduct = (product) => {
        const user = authSeller.currentUser;
        if (user && product._id) {
            navigate(`/seller/${user.uid}/updateProduct/${product._id}`, { state: product });
        }
    };

    const deleteProduct = async (product) => {
        try {
            const user = authSeller.currentUser;
            if (!user) {
                navigate('/seller-login');
                return;
            }
            await axios.delete(`http://localhost:3000/seller/${myUser.uid}/deleteProduct/${product._id}`);
            alert("Deleted Successfully");
            setMyProducts(myProducts.filter((p) => p._id !== product._id));
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete product. Please try again.");
        }
    };

    return (
        <div className="seller-home-div">
            <Col className="seller-home-col-1">
                <h4 style={{ margin: 0, fontWeight: 700, fontSize: "1.5rem" }}>SALES PERFORMANCE</h4>
            </Col>

            <Col className="seller-home-col-2">
                <div className="my_products">
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: "1.5rem" }}>YOUR PRODUCTS</h4>
                    <Button onClick={handleAddProduct}>Add New Product</Button>
                </div>
                <div className="products_render">
                    {loading ? (
                        <div className="loading-container">
                            <Spinner animation="border" role="status" variant="primary">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <p>Loading products, please wait...</p>
                        </div>
                    ) : myProducts.length > 0 ? (
                        myProducts.map((product, index) => (
                            <Card className="product_card" key={index}>
                                <Card.Img
                                    className="product_image"
                                    variant="top"
                                    src={product.image}
                                    alt={product.title}
                                />
                                <Card.Body className="product-card-body">
                                    <Card.Title className="product-card-title">{product.title}</Card.Title>
                                    <Card.Text className="product-card-price">
                                        Price: {product.price ? `₹${product.price - (product.discount / 100) * product.price}` : "Price"}{" "}
                                        {product.discount ? (
                                            <span className="product-card-discount">({product.discount}% off)</span>
                                        ) : null}
                                    </Card.Text>
                                    <Card.Text className="product-card-mrp">
                                        M.R.P: {product.price}
                                    </Card.Text>
                                    <div className="product-card-buttons">
                                        <Button
                                            className="edit-btn"
                                            variant="primary"
                                            onClick={() => updateProduct(product)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className="delete-btn"
                                            variant="danger"
                                            onClick={() => deleteProduct(product)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <h3>No products available.</h3>
                    )}
                </div>
            </Col>
        </div>
    );
}

export default SellerHome;
