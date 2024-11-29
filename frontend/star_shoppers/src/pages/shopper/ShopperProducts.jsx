import axios from "axios"
import { useEffect, useState } from "react"
import { Col,Form,Button,Card } from "react-bootstrap"
import { authShopper } from "../../firebase"
import '../../CSS/shopper/ShopperProducts.css'
import img from '../../assets/image.jpg'

export default function ShopperProducts(){
    const [shopper,setShopper] = useState(null);
    const [products,setProducts] = useState([]);
    const categories_names=['Electronics','Fashion','Home-Appliances','Books',
                    'Sports & Outdoors','Health & Beauty','Groceries',
                    'Furniture','Automotive','jewelley & Watches',
                    'Food & Beverages','Baby Products','Office Supplies','Others'];
    
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8",
                    "#33FFF5", "#FF8C33", "#D433FF", "#FF5733", 
                    "#57FF33", "#33A8FF", "#F5FF33", "#FF33F5", 
                    "#33FFD4", "#FFD433"
        ];
    useEffect(() => {
        const unsubscribe = authShopper.onAuthStateChanged((user) => {
            setShopper(user); 
        });
        return () => unsubscribe(); 
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            if (shopper) {
                try {
                    const result = await axios.get(`http://localhost:3000/shopper/${shopper.uid}/products-home`);
                    if (result) {
                        console.log(result.data.data.products);
                        setProducts(result.data.data.products);
                    }
                } catch (error) {
                    console.log("Error fetching products:", error);
                }
            }
        };
        fetchProducts();
    }, [shopper]);
   
    return(
        <div style={{display:"grid",gridTemplateColumns:"30% 70%"}}>
            <Col className="search-col">
                <Form style={{borderBottom:"1px solid gray"}}>
                    <Form.Group className="mb-3 input_form_group" controlId="search">
                        <Form.Control className="input_bar" type="text" placeholder="Search for items" />
                    </Form.Group>
                </Form>
                <div className="price-container">
                    <div className="price-input">
                        <label htmlFor="priceLess">Price less than:</label>
                        <input type="number" placeholder=" _ _ _ _ _ _ _ _"/>
                    </div>
                    <div className="price-input">
                        <label htmlFor="priceMore">Price more than:</label>
                        <input type="number" placeholder=" _ _ _ _ _ _ _ _" />
                    </div>
                </div>
                <h6 style={{padding:"1rem 2rem 0rem"}}>Sort By:</h6>
                <Form style={{padding:"0rem 2rem"}}>
                    <Form.Group className="mb-3" controlId="ProductCategory">
                        <Form.Select>
                            <option value="">Select</option>
                            <option value="price">Price</option>
                            <option value="discount">Discount</option>
                            <option value="alphabetical">A to Z</option>
                            <option value="alphabetical-reverse">Z to A</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
                <h6 style={{padding:"1rem 2rem 0rem"}}>Category</h6>
                <div className="categories">
                    {categories_names.map((category,index)=>(
                       <button key={index} style={{backgroundColor:colors[index%colors.length]}} onClick={()=>{
                        backgroundColor:"gray"
                       }}>{category}</button> 
                    ))}
                </div>                
            </Col>
            <Col className="products-display">
                <h4 style={{fontWeight:700}}><i>SELECT A PRODUCT AND ADD TO CART</i></h4>
                {products.length > 0 && (
                    <div style={{display:"flex",flexWrap:"wrap"}}>
                        {products.map(product => (
                            <div key={product.id}>
                                <Card>
                                    <Card.Img 
                                        height={100}
                                        width={100}
                                        className="image_product"
                                        variant="top"
                                        src={product.image || img}
                                        alt={product.title}
                                    />
                                    <Card.Body>
                                        <Card.Title style={{textAlign:"center",fontWeight:500,fontSize:"1rem"}}>{product.title}</Card.Title>
                                        <div style={{display:"flex",gap:"1rem",alignItems:"start",justifyContent:"center",textAlign:"center"}}>
                                            <Card.Text>Rs.{product.price}</Card.Text>
                                            <Card.Text>({product.discount}% OFF)</Card.Text>
                                        </div>
                                        <Card.Text>Rs.{product.price-product.price*product.discount/100}</Card.Text>
                                    </Card.Body>
                                    <Button variant="primary">Add to Cart</Button>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </Col>
        </div>
    )
}