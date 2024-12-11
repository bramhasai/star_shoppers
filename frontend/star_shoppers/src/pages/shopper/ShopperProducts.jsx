import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Form, Button, Card } from "react-bootstrap";
import { authShopper } from "../../firebase";
import "../../CSS/shopper/ShopperProducts.css";
import img from "../../assets/image.jpg";
import algoliasearch from "algoliasearch";
import { useNavigate } from "react-router-dom";

const client = algoliasearch('AN5IZ09K1M', '750deda1f27131266eef48792fdcce83');
const index = client.initIndex('products');

export default function ShopperProducts({handleAddToCart,cartItems}) {
  const [shopper, setShopper] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigate = useNavigate();

  const categories_names = [
    "Electronics",
    "Fashion",
    "Home-Appliances",
    "Books",
    "Sports & Outdoors",
    "Health & Beauty",
    "Groceries",
    "Furniture",
    "Automotive",
    "Jewellery & Watches",
    "Food & Beverages",
    "Baby Products",
    "Office Supplies",
    "Others",
  ];

  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A8",
    "#33FFF5",
    "#FF8C33",
    "#D433FF",
    "#57FF33",
    "#33A8FF",
    "#F5FF33",
    "#FF33F5",
    "#33FFD4",
    "#FFD433",
  ];

  // Check user authentication
  useEffect(() => {
    const unsubscribe = authShopper.onAuthStateChanged((user) => {
      setShopper(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      if (shopper) {
        try {
          const result = await axios.get(
            `http://localhost:3000/shopper/${shopper.uid}/products-home`
          );
          if (result) {
            setProducts(result.data.data.products);
            setFilteredProducts(result.data.data.products); // Default to show all products
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };
    fetchProducts();
  }, [shopper]);

  // Handle Search Query with Algolia
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const { hits } = await index.search(searchQuery);
          const hitIds = hits.map((hit) => hit.objectID);

          // Filter products that match Algolia's objectIDs
          const matchingProducts = products.filter((product) =>
            hitIds.includes(product._id)
          );
          setFilteredProducts(matchingProducts);
        } catch (error) {
          console.error("Error searching products:", error);
        }
      } else {
        setFilteredProducts(products); // Show all products if no search query
      }
    };
    searchProducts();
  }, [searchQuery, products]);

  // Filter by Price Range and Category
  useEffect(() => {
    let tempProducts = products;

    // Apply category filter
    if (selectedCategory) {
      tempProducts = tempProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply price range filter
    if (priceRange.min || priceRange.max) {
      tempProducts = tempProducts.filter((product) => {
        const price =
          product.price - (product.price * product.discount) / 100;
        return (
          (!priceRange.min || price >= priceRange.min) &&
          (!priceRange.max || price <= priceRange.max)
        );
      });
    }

    // Apply sorting
    if (sortOption === "LowToHigh") {
      tempProducts = [...tempProducts].sort((a, b) => a.price - b.price);
    }if (sortOption === "HighToLow") {
        tempProducts = [...tempProducts].sort((a, b) => b.price - a.price);
    }else if (sortOption === "discount") {
      tempProducts = [...tempProducts].sort(
        (a, b) => b.discount - a.discount
      );
    } else if (sortOption === "alphabetical") {
      tempProducts = [...tempProducts].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else if (sortOption === "alphabetical-reverse") {
      tempProducts = [...tempProducts].sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    setFilteredProducts(tempProducts);
  }, [products, priceRange, selectedCategory, sortOption]);

  // Reset filters and show all products
  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setSelectedCategory("");
    setSortOption("");
    setFilteredProducts(products);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "30% 70%" }}>
      <Col className="search-col">
        <Form style={{ borderBottom: "1px solid gray" }}>
          <Form.Group className="mb-3 input_form_group" controlId="search">
            <Form.Control
              className="input_bar"
              type="text"
              placeholder="Search for items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault(); // Prevent refreshing or losing results
              }}
            />
          </Form.Group>
        </Form>

        <div className="price-container">
          <div className="price-input">
            <label htmlFor="priceLess">Price less than: Rs.</label>
            <input
              type="number"
              placeholder="_ _ _ _ _ _ _ _"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: e.target.value })
              }
            />
          </div>
          <div className="price-input">
            <label htmlFor="priceMore">Price more than: Rs.</label>
            <input
              type="number"
              placeholder="_ _ _ _ _ _ _ _"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: e.target.value })
              }
            />
          </div>
        </div>
        <h6 style={{ padding: "1rem 2rem 0rem" }}>Sort By:</h6>
        <Form style={{ padding: "0rem 2rem" }}>
          <Form.Group className="mb-3" controlId="ProductCategory">
            <Form.Select onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Select</option>
              <option value="LowToHigh">Low to High price</option>
              <option value="HighToLow">High to Low price</option>
              <option value="discount">Discount</option>
              <option value="alphabetical">A to Z</option>
              <option value="alphabetical-reverse">Z to A</option>
            </Form.Select>  
          </Form.Group>
        </Form>

        <h6 style={{ padding: "1rem 2rem 0rem" }}>Category</h6>
        <div className="categories">
          {categories_names.map((category, index) => (
            <button
              key={index}
              style={{
                backgroundColor: colors[index % colors.length],
              }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Button
            style={{ marginTop: "1rem",width:"80%"}}
            variant="secondary"
            onClick={resetFilters}
            >
            Reset Filters
            </Button>
        </div>        
      </Col>
      <Col className="products-display">
        <h4 style={{ fontWeight: 700 }}>
          <i>SELECT A PRODUCT AND ADD TO CART</i>
        </h4>
        {filteredProducts.length > 0 ? (
          <div className="products-div">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="product-card">
                <Card.Img
                  className="image_product"
                  variant="top"
                  src={product.image || img}
                  alt={product.title}
                />
                <Card.Body style={{ padding: 0, paddingBottom: "0.5rem" }}>
                  <Card.Title
                    style={{
                      textAlign: "center",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                      margin: 0,
                    }}
                  >
                    {product.title}
                  </Card.Title>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "start",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Card.Text
                      style={{
                        margin: 0,
                        textDecoration: "line-through",
                        color: "#A9A9A9",
                      }}
                    >
                      Rs.{product.price}
                    </Card.Text>
                    <Card.Text style={{ margin: 0, color: "#FF4500" }}>
                      ({product.discount}% OFF)
                    </Card.Text>
                  </div>
                  <Card.Text
                    style={{
                      textAlign: "center",
                      color: "#1E90FF",
                      fontWeight: 600,
                      fontSize: "1.1rem",
                    }}
                  >
                    Rs.
                    {product.price -
                      (product.price * product.discount) / 100}
                  </Card.Text>
                </Card.Body>

                {cartItems[product._id]?
                  (
                    <Button
                      variant="success"
                      onClick={() => navigate(`/shopper/${shopper.uid}/cart`)} 
                    >
                      Go to Cart
                    </Button>
                  ):
                  (
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleAddToCart({
                          [product._id]: {
                            title: product.title,
                            price:
                              product.price -
                              (product.price * product.discount) / 100,
                            image: product.image,
                            quantity: 1,
                          },
                        });
                      }}
                    >
                      Add to Cart
                    </Button>
                  )
                }
              </Card>
            ))}
          </div>
        ) : (
          <p>No products found</p>
        )}
      </Col>
    </div>
  );
}

