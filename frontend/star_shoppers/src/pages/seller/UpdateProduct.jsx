import { Col,Button,Form } from "react-bootstrap";
import '../../CSS/seller/UpdateProduct.css';
import image from '../../assets/image.jpg'
export default function UpdateProduct(){
    return(
        <div className="update-product-div">
            <Col className="update-product-col-1">
                <Form className="update_products_form">
                    <Form.Group className="mb-3" controlId="ProductTitle">
                        <Form.Control type="text" placeholder="Product Title" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ProductDescription">
                        <Form.Control 
                            as="textarea" 
                            rows={4}
                            placeholder="Product Description"
                        />
                    </Form.Group>

                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"}}>
                        <Form.Group className="mb-3" style={{width:"100%"}} controlId="ProductPrice">
                            <Form.Control type="number" placeholder="Product Price" />
                        </Form.Group>

                        <Form.Group className="mb-3" style={{width:"100%"}} controlId="ProductDiscount">
                            <Form.Control type="number" placeholder="Product Discount %" />
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-3" controlId="ProductCategory">
                        <Form.Control type="text" placeholder="Enter Category" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="ProductTitle">
                        <Form.Control type="text" placeholder="Enter Image URL" />
                    </Form.Group>

                    <Button variant="success">Update Product</Button>
                </Form>
            </Col>

            <Col className="update-product-col-2">
                <h4 style={{margin:"0rem", fontWeight:700}}>LIVE PREVIEW</h4>
                <p>This is how, your customers will see your product on the website</p>
                <img src={image} alt="" height={200} width={200}/>
                <h4>Title</h4>
                <p>Price <span>(10% off)</span></p>
                <Button variant="primary">Add to Cart</Button>
            </Col>
        </div>
    )
}