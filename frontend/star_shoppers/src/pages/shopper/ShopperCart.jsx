import { useEffect, useState } from "react"
import { Col,Button,Card, CardBody,Form } from "react-bootstrap";
import '../../CSS/shopper/ShopperCart.css'
import cart_image from '../../assets/cart.png'
import { authShopper } from "../../firebase";
export default function ShopperCart({handleClearCart,cartItems}){
    const [totalQuantity,setTotalQuantity] = useState(0);
    const [totalPrice,setTotalPrice] = useState(0);
    const [shopper, setShopper] = useState(null);
    const [localCartItems, setLocalCartItems] = useState(cartItems);

    useEffect(() => {
        const unsubscribe = authShopper.onAuthStateChanged((user)=>{
            setShopper(user);
        })
        return () => unsubscribe();
    }, []);

    useEffect(()=>{
        setLocalCartItems(cartItems)
    },[cartItems])

    useEffect(()=>{
        let tempPrice = 0;
        let tempQuantity = 0;
        Object.keys(localCartItems).map((cartitemId)=>{
            const cart_details = localCartItems[cartitemId];
            tempQuantity += cart_details.quantity;
            tempPrice += cart_details.price*cart_details.quantity;
        })
        setTotalQuantity(tempQuantity);
        setTotalPrice(tempPrice);
    },[localCartItems]);

    const handleQuantityChange = (cartItemId,newQuantity)=>{
        const quantity = Math.max(1,parseInt(newQuantity));
        const updatedCartItems = {...localCartItems};
        updatedCartItems[cartItemId] = {
            ...updatedCartItems[cartItemId],
            quantity: quantity
        };
        setLocalCartItems(updatedCartItems);
        if(shopper){
            localStorage.setItem(`cartItems_${shopper.uid}`,JSON.stringify(updatedCartItems));
        }
    };

    const removeCartItem = (cartItemId)=>{
        const updatedCartItems = {...localCartItems};
        delete updatedCartItems[cartItemId];
        setLocalCartItems(updatedCartItems);
        if(shopper){
            localStorage.setItem(`cartItems_${shopper.uid}`,JSON.stringify(updatedCartItems));
        }
    }

    return(
        <div className="cart_page" style={{display:"grid",gridTemplateColumns:"50% 50%"}}>
            <Col className="cart-col-1">
                <div className="div1-col1">
                    <h4 style={{margin:0}}>Your Cart Items</h4>
                    <Button onClick={()=>{
                        handleClearCart();
                        setTotalPrice(0);
                        setTotalQuantity(0);
                    }}>Remove All Items</Button>
                </div>
                <div className="div2-col1">
                    {Object.keys(localCartItems).map((cartItemId)=>{
                        const cartItemDetails = localCartItems[cartItemId];
                        return(
                            <Card className="Cart-card">
                                <Card.Body>
                                    <Card.Img
                                        style={{height:"6rem",width:"6rem"}}
                                        src={cartItemDetails.image}
                                        alt={cartItemDetails.title}
                                    />
                                </Card.Body>
                                <Card.Body style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                                        <Card.Title style={{margin:"0",fontWeight:"500",fontSize:"1rem"}}>
                                            {cartItemDetails.title}
                                        </Card.Title>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => removeCartItem(cartItemId)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    <Card.Text style={{margin:"0"}}>
                                        Price: Rs. {cartItemDetails.price}
                                    </Card.Text>
                                    <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"start",gap:"1rem"}}>
                                        <p style={{margin:"0"}}>Quantity : </p>
                                        <Form>
                                            <Form.Group style={{marginBottom:"0rem"}} className="mb-3" controlId="Quantity" >
                                                <Form.Select 
                                                    value = {cartItemDetails.quantity}
                                                    onChange={(e)=>handleQuantityChange(cartItemId,e.target.value)}>
                                                    {[...Array(10)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Form>
                                        <p style={{margin:"0"}}>
                                            Total Price of item: Rs.{cartItemDetails.price * cartItemDetails.quantity}
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
                <div style={{marginTop: "1rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                        <h5 style={{margin: "0rem"}}>Total Cart Value: Rs. {totalPrice.toFixed(2)}</h5>
                        <h5 style={{margin: "0rem"}}>Total Items: {totalQuantity}</h5>
                    </div>
                    <div>
                        <Button 
                            disabled={totalPrice <= 0 || totalQuantity <= 0}
                            style={{
                                backgroundColor: (totalPrice <= 0 || totalQuantity <= 0) ? 'grey' : '#007bff', // Grey when disabled, blue when active
                                borderColor: (totalPrice <= 0 || totalQuantity <= 0) ? 'grey' : '#007bff',
                            }} 
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </div>
            </Col>
            <Col>
                <div className="cart-col-2">
                    <img style={{height:"70%",width:"60%"}} src={cart_image} alt="" />
                </div>
            </Col>
        </div>
    )
}