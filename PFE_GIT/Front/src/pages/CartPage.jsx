import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Alert, Col, Table } from "react-bootstrap";
import "./CartPage.css";
import {
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
  useRemoveFromCartMutation,
} from "../services/appApi";

const CartPage = () => {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);

  const userObj = user.cart;
  let cart = products.filter((product) => userObj[product._id] != null);
  const [increaseCart] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();
  function handleDecrease(product) {
    const quantity = user.cart.count;
    if (quantity <= 0) return alert("Can't proceed");
    decreaseCart(product);
  }
  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h1 className="text-center">Shopping Cart</h1>
          {cart.length == 0 ? (
            <Alert variant="info" className="text-center">
              Shopping cart is empty . Add products to your cart
            </Alert>
          ) : (
            <div>Paiment</div>
          )}
        </Col>
        {cart.length > 0 && (
          <Col md={6}>
            <>
              <Table
                responsive="sm"
                variant="dark"
                className="cart-table text-center "
              >
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {/* loop through cart products */}
                  {cart.map((item, key) => (
                    <tr key={key}>
                      <td>&nbsp;</td>
                      <td>
                        {!isLoading && (
                          <i
                            className="fa fa-times"
                            style={{ marginRight: 10, cursor: "pointer" }}
                            onClick={() =>
                              removeFromCart({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          ></i>
                        )}
                        <img
                          src={item.pictures[0].url}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{item.price} TND</td>
                      <td>
                        <span className="quantity-indicator">
                          <i
                            className="fa fa-minus-circle"
                            onClick={() =>
                              handleDecrease({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          ></i>
                          <span>{user.cart[item._id]}</span>
                          <i
                            className="fa fa-plus-circle"
                            onClick={() =>
                              increaseCart({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          ></i>
                        </span>
                      </td>
                      <td>{item.price * user.cart[item._id]} TND</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <h3 className="h4 pt-4">Total: {user.cart.total} TND</h3>
              </div>
            </>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default CartPage;
