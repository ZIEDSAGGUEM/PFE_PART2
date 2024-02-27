import { Container, Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/userSlice";
import "./Navigation.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const divRef = useRef(null);
  const handleClick = (event) => {
    const divContent =
      event.currentTarget.textContent || event.currentTarget.innerText;

    const utterance = new SpeechSynthesisUtterance(divContent);
    utterance.lang = "fr-FR"; // Code de langue français
    window.speechSynthesis.speak(utterance);
  };

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }
  const [color, setColor] = useState(false);
  const changeColor = () => {
    if (window.scrollY >= 75) {
      setColor(true);
    } else {
      setColor(false);
    }
  };
  window.addEventListener("scroll", changeColor);

  return (
    <Navbar
      expand="lg"
      className={
        color
          ? " bg-black  sticky-top  fw-bolder"
          : "bg-secondary bg-opacity-50 sticky-top  fw-bolder "
      }
    >
      <Container>
        <LinkContainer to={"/"}>
          <Navbar.Brand
            className="  text-white"
            ref={divRef}
            onClick={handleClick}
            tabIndex="0"
            aria-label="Cliquez pour entendre le contenu"
          >
            X-Store
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className=" text-white"
        />
        <Navbar.Collapse id="basic-navbar-nav" className=" text-white ">
          <Nav className="mx-auto ">
            <LinkContainer to="/category/all">
              <Nav.Link
                as={Link}
                className=" text-white mt-2"
                ref={divRef}
                onClick={handleClick}
                tabIndex="0"
                aria-label="Cliquez pour entendre le contenu"
              >
                Produits
              </Nav.Link>
            </LinkContainer>

            <Nav.Link
              to="/#categorie"
              as={Link}
              className=" text-white mt-2"
              ref={divRef}
              onClick={handleClick}
              tabIndex="0"
              aria-label="Cliquez pour entendre le contenu"
            >
              Catégories
            </Nav.Link>

            <LinkContainer to="/contact">
              <Nav.Link
                className=" text-white mt-2"
                ref={divRef}
                onClick={handleClick}
                tabIndex="0"
                aria-label="Cliquez pour entendre le contenu"
              >
                Contact
              </Nav.Link>
            </LinkContainer>
            {/*Si Utilisateur Existe*/}
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link
                  className=" text-white mt-2"
                  ref={divRef}
                  onClick={handleClick}
                  tabIndex="0"
                  aria-label="Cliquez pour entendre le contenu"
                >
                  Connecter
                </Nav.Link>
              </LinkContainer>
            )}

            {user && (
              <NavDropdown
                title={
                  <>
                    <img
                      src={user.picture}
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 10,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      alt="User Avatar"
                    />
                    <span className="text-white">{user.name}</span>
                  </>
                }
                className=" bg-secondary rounded-5"
                id="basic-nav-dropdown"
              >
                {" "}
                {user.isAdmin && (
                  <>
                    <LinkContainer to="/admin">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/new-product">
                      <NavDropdown.Item>Créer un produit</NavDropdown.Item>
                    </LinkContainer>
                  </>
                )}
                {!user.isAdmin && (
                  <>
                    <LinkContainer to="/cart">
                      <NavDropdown.Item>Votre Carte</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orders">
                      <NavDropdown.Item>Votre Ordre</NavDropdown.Item>
                    </LinkContainer>
                  </>
                )}
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="mx-auto d-block align-items-center w-75"
                >
                  Déconnecter
                </Button>
              </NavDropdown>
            )}
            {user && !user.isAdmin && (
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i
                    className="fa-solid fa-cart-shopping fs-5 mt-3"
                    style={{ color: "#ffffff" }}
                  ></i>
                  {user?.cart.count > 0 && (
                    <span className="badge badge-warning" id="cartcount">
                      {user.cart.count}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}
            {user && !user.isAdmin && (
              <LinkContainer to="/favorite">
                <Nav.Link>
                  <i
                    className="fa-solid fa fa-heart fs-5 mt-3"
                    style={{ color: "#ffffff" }}
                  ></i>
                  {user?.favorites.length > 0 && (
                    <span className="badge badge-warning" id="cartcount">
                      {user.favorites.length}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
