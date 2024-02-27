import axios from "../axios";
import React, { useEffect, useRef, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import {
  Container,
  Row,
  Col,
  Badge,
  ButtonGroup,
  Form,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import SimilarProduct from "../components/SimilarProduct";
import "./ProductPage.css";
import { LinkContainer } from "react-router-bootstrap";
import {
  useAddToCartMutation,
  useAddToFavoritesMutation,
} from "../services/appApi";
import ToastMessage from "../components/ToastMessage";

function ProductPage() {
  const divRef = useRef(null);
  const handleClick = (event) => {
    const divContent =
      event.currentTarget.textContent || event.currentTarget.innerText;

    const utterance = new SpeechSynthesisUtterance(divContent);
    utterance.lang = "fr-FR"; // Code de langue français
    window.speechSynthesis.speak(utterance);
  };

  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [addToCart, { isSuccess: cartSuccess }] = useAddToCartMutation();
  const [addToFavorites, { isSuccess: favoritesSuccess }] =
    useAddToFavoritesMutation();

  const handleDragStart = (e) => e.preventDefault();
  useEffect(() => {
    axios.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.product);
      setSimilar(data.similar);
    });
  }, [id]);

  if (!product) {
    return <Loading />;
  }
  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
  };

  const images = product.pictures.map((picture, key) => (
    <img
      className="product__carousel--image"
      src={picture.url}
      onDragStart={handleDragStart}
      key={key}
    />
  ));

  let similarProducts = [];
  if (similar) {
    similarProducts = similar.map((product, idx) => (
      <div className="item" key={idx} data-value={idx}>
        <SimilarProduct {...product} />
      </div>
    ));
  }

  return (
    <Container className="pt-4" style={{ position: "relative" }}>
      <Row>
        <Col lg={6}>
          <AliceCarousel
            mouseTracking
            items={images}
            controlsStrategy="alternate"
            ref={divRef}
            onClick={handleClick}
            tabIndex="0"
            aria-label="Cliquez pour entendre le contenu"
          />
        </Col>
        <Col
          lg={6}
          className="pt-4"
          ref={divRef}
          onClick={handleClick}
          tabIndex="0"
          aria-label="Cliquez pour entendre le contenu"
        >
          <h1>{product.name}</h1>
          <p>
            <Badge bg="primary">
              <strong>Categorie :</strong>
              {product.category}
            </Badge>
          </p>
          <p className="product__price">
            <strong>Prix :</strong> TND {product.price}
          </p>
          <p style={{ textAlign: "justify" }} className="py-3">
            <strong>Description:</strong> {product.description}
          </p>
          {user && !user.isAdmin && (
            <ButtonGroup style={{ width: "90%", marginRight: "25px" }}>
              <Button
                className="mx-4"
                size="lg"
                onClick={() =>
                  addToCart({
                    userId: user._id,
                    productId: id,
                    price: product.price,
                    image: product.pictures[0].url,
                  })
                }
              >
                Ajouter au Panier
              </Button>
              <Button
                size="lg"
                onClick={() =>
                  addToFavorites({
                    userId: user._id,
                    productId: id,
                    price: product.price,
                    image: product.pictures[0].url,
                  })
                }
              >
                Ajouter au Favoris
              </Button>
            </ButtonGroup>
          )}
          {user && user.isAdmin && (
            <LinkContainer to={`/product/${product._id}/edit`}>
              <Button size="lg">Edit Product</Button>
            </LinkContainer>
          )}
          {cartSuccess && (
            <ToastMessage
              bg="info"
              title="Added to cart"
              body={`${product.name} is in your cart`}
            />
          )}
          {favoritesSuccess && (
            <ToastMessage
              bg="info"
              title="Ajouté au Favoris"
              body={`${product.name} est Ajouté au Favoris`}
            />
          )}
        </Col>
      </Row>
      <div
        className="my-4"
        ref={divRef}
        onClick={handleClick}
        tabIndex="0"
        aria-label="Cliquez pour entendre "
      >
        <h2>Produits Similaires</h2>
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <AliceCarousel
            mouseTracking
            items={similarProducts}
            responsive={responsive}
            controlsStrategy="alternate"
          />
        </div>
      </div>
    </Container>
  );
}

export default ProductPage;
