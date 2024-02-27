import React, { useEffect, useRef, useState } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Row, Col } from "react-bootstrap";
import categories from "../Categories";
import Carousel from "../components/Carousel";
import "./Home.css";
import aos from "aos";
import "aos/dist/aos.css";
import { useDispatch, useSelector } from "react-redux";
import { updateProducts } from "../features/productSlice";
import ProductPreview from "../components/ProductPreview";

import Footer from "../components/Footer";

import { MDBListGroup, MDBListGroupItem, MDBCheckbox } from "mdb-react-ui-kit";

const Home = () => {
  const divRef = useRef(null);
  const user = useSelector((state) => state.user);

  const handleClick = (event) => {
    const divContent =
      event.currentTarget.textContent || event.currentTarget.innerText;

    const utterance = new SpeechSynthesisUtterance(divContent);
    utterance.lang = "fr-FR"; // Code de langue français
    window.speechSynthesis.speak(utterance);
  };
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const lastProducts = products.slice(2, 8);

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleCheckboxChange = (price) => {
    // Set the selected price directly without toggling
    setSelectedPrice(price);

    // Fetch filtered products based on selected price
    axios
      .get(`http://localhost:8080/products/filter?maxPrice=${price}`)
      .then((response) => setFilteredProducts(response.data))
      .catch((error) =>
        console.error("Error fetching filtered products:", error)
      );
  };

  useEffect(() => {
    aos.init({ duration: 2500 });
  });

  return (
    <div className=" overflow-hidden">
      <div className="x">
        <Carousel />
      </div>

      <div className="featured-products-container container mt-4">
        <h2>Derniers Produits</h2>
        {/* last products here */}
        <div
          className="d-flex justify-content-center flex-wrap"
          data-aos="slide-right"
        >
          {lastProducts.map((product, key) => (
            <ProductPreview key={key} {...product} />
          ))}
        </div>
        <div className="container">
          <h1 className="mt-5">Filtrage</h1>
          <MDBListGroup className=" d-flex  flex-row flex-wrap justify-content-center   ">
            {[300, 900, 1500, 3000, 5000, 7500, 9000, 12000, 15000].map(
              (price) => (
                <MDBListGroupItem
                  key={price}
                  className=" rounded-circle text-center text-white bg-transparent mx-2 my-2 "
                  style={{ border: "none" }}
                >
                  <MDBCheckbox
                    onChange={() => handleCheckboxChange(price)}
                    checked={selectedPrice === price}
                  />
                  {price}
                </MDBListGroupItem>
              )
            )}
          </MDBListGroup>

          <div className="d-flex justify-content-center flex-wrap">
            {filteredProducts.map((product, key) => (
              <ProductPreview key={key} {...product} />
            ))}
          </div>
        </div>
        <div>
          <Link
            to="/category/all"
            style={{
              textAlign: "right",
              display: "block",
              textDecoration: "none",
            }}
          >
            Voir Plus {">>"}
          </Link>
        </div>
      </div>
      {/* sale banner */}
      <div className="sale__banner--container mt-4">
        <img
          src="https://image.jeuxvideo.com/medias-md/170532/1705315355-5724-card.gif"
          style={{ width: "50%", height: "auto" }}
          data-aos="zoom-in-up"
        />
      </div>
      <div id="categorie" className="recent-products-container container mt-4">
        <h2>Categories</h2>
        <Row>
          {categories.map((category, key) => (
            <LinkContainer
              data-aos="slide-left"
              key={key}
              to={`/category/${category.name.toLocaleLowerCase()}`}
            >
              <Col md={4}>
                <div
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`,
                    gap: "10px",
                  }}
                  className="category-tile"
                  ref={divRef}
                  onClick={handleClick}
                  tabIndex="0"
                  aria-label="Cliquez pour entendre le contenu"
                >
                  {category.name}
                </div>
              </Col>
            </LinkContainer>
          ))}
        </Row>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
