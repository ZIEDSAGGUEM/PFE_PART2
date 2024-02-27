import React, { useRef } from "react";
import { Badge, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function ProductPreview({ _id, category, name, price, pictures }) {
  const divRef = useRef(null);
  const handleClick = (event) => {
    const divContent =
      event.currentTarget.textContent || event.currentTarget.innerText;

    const utterance = new SpeechSynthesisUtterance(divContent);
    utterance.lang = "fr-FR"; // Code de langue français
    window.speechSynthesis.speak(utterance);
  };
  return (
    <LinkContainer
      to={`/product/${_id}`}
      style={{ cursor: "pointer", margin: "10px" }}
    >
      <Card
        style={{
          margin: "10px",
        }}
        ref={divRef}
        onClick={handleClick}
        tabIndex="0"
        data-aos="slide-right"
      >
        <Card.Img
          className="product-preview-img"
          src={pictures[0].url}
          style={{
            height: "225px",
            objectFit: "cover",
          }}
        />
        <Card.Body
          style={{ height: "150px", textAlign: "center" }}
          className=" bg-dark bg-opacity-100  text-white  "
        >
          <Card.Title>{name}</Card.Title>
          <Card.Title>{price} TND</Card.Title>
          <Badge bg="danger">{category}</Badge>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}

export default ProductPreview;
