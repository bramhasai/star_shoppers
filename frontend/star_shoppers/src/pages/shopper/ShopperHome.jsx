import { Carousel,Row,Col,Button } from "react-bootstrap";
//firebase
import { authShopper } from "../../firebase";

//images
import HomeImageOne from '../../assets/Home1.png';
import HomeImageTwo from '../../assets/Home2.png';
import HomeImageThree from '../../assets/Home3.png';
import brand1 from '../../assets/brand1.png';
import brand2 from '../../assets/brand2.png';
import brand3 from '../../assets/brand3.png';
import brand4 from '../../assets/brand4.png';
import brand5 from '../../assets/brand5.png';
import brand6 from '../../assets/brand6.png';

//css
import '../../CSS/shopper/ShopperHome.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShopperHome (){
    const navigate  = useNavigate();
    const [shopper,setShopper] =useState(null);
    useEffect(()=>{
        const user = authShopper.currentUser;
        setShopper(user);
    },[]);

    const handleCTAClick = ()=>{
        if(shopper){
            navigate(`/shopper/${shopper.uid}/products-home`);
        }else{
            navigate('/shopper-login');
        }
    }


    return(
        <div className="home-page-shopper">
            <Carousel>
                <Carousel.Item style={{height:"87vh"}}>
                    <Row className='Home-page-data'>
                        <Col>
                            <div className='Home-text'>
                                <h3><i>SHOP WITH UTMOST</i></h3>
                                <h2><i>STYLE</i></h2>
                                <h6>Shop from the latest trendy clothes to the best gadgets. 
                                    With Star Shopper you save 10% every time you shop!
                                </h6>
                                <Button onClick={handleCTAClick}  className='Button_browse'>Browse Products</Button>
                                <h6>Products available from :</h6>
                                <div className="brands">
                                    <img src={brand1} alt="" />
                                    <img src={brand2} alt="" />
                                    <img src={brand3} alt="" />
                                    <img src={brand4} alt="" />
                                    <img src={brand5} alt="" />
                                    <img src={brand6} alt="" />
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <img src={HomeImageOne} alt="" style={{height: "86vh"}}/>
                        </Col>
                    </Row>
                </Carousel.Item>

                <Carousel.Item style={{height:"87vh"}}>
                    <Row className='Home-page-data'>
                        <Col>
                            <div className='Home-text'>
                                <h3><i>SHOP WITH UTMOST</i></h3>
                                <h2><i>DISCOUNTS</i></h2>
                                <h6>Shop from the latest trendy clothes to the best gadgets. 
                                    With Star Shopper you save 10% every time you shop!
                                </h6>
                                <Button onClick={handleCTAClick}  className='Button_browse'>Browse Products</Button>
                                <h6>Products available from :</h6>
                                <div className="brands">
                                    <img src={brand1} alt="" />
                                    <img src={brand2} alt="" />
                                    <img src={brand3} alt="" />
                                    <img src={brand4} alt="" />
                                    <img src={brand5} alt="" />
                                    <img src={brand6} alt="" />
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <img src={HomeImageTwo} alt="" style={{height: "86vh"}}/>
                        </Col>
                    </Row>
                </Carousel.Item>

                <Carousel.Item style={{height:"87vh"}}>
                    <Row className='Home-page-data'>
                        <Col>
                            <div className='Home-text'>
                                <h3><i>SHOP WITH UTMOST</i></h3>
                                <h2><i>MODELS</i></h2>
                                <h6>Shop from the latest trendy clothes to the best gadgets. 
                                    With Star Shopper you save 10% every time you shop!
                                </h6>
                                <Button onClick={handleCTAClick} className='Button_browse'>Browse Products</Button>
                                <h6>Products available from :</h6>
                                <div className="brands">
                                    <img src={brand1} alt="" />
                                    <img src={brand2} alt="" />
                                    <img src={brand3} alt="" />
                                    <img src={brand4} alt="" />
                                    <img src={brand5} alt="" />
                                    <img src={brand6} alt="" />
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <img src={HomeImageThree} alt="" style={{height: "86vh"}}/>
                        </Col>
                    </Row>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}