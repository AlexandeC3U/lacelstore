import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOutUserStart } from "../../redux/User/user.actions";
import { selectCartItemsCount } from "../../redux/Cart/cart.selectors";
import "./styles.scss";
import Logo from "../../assets/logo.png";
import { Link, useHistory } from "react-router-dom";
import Item from "./Item";
import Button from "../Forms/Button";
import { createStructuredSelector } from "reselect";
import {
  selectCartItems,
  selectCartTotal,
} from "../../redux/Cart/cart.selectors";

const mapState = (state) => ({
  currentUser: state.user.currentUser,
  totalNumCartItems: selectCartItemsCount(state),
});

const mapState2 = createStructuredSelector({
  cartItems: selectCartItems,
  total: selectCartTotal,
});

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { cartItems, total } = useSelector(mapState2);
  const { currentUser, totalNumCartItems } = useSelector(mapState);
  const emptyCart = "You have no items in your cart";

  const signOut = () => {
    dispatch(signOutUserStart());
  };

  const handleOnClick = () => {
    history.push("/cart");
    toggleCart();
  };

  return (
    <header className="header">
      <div className="container">
        {totalNumCartItems > 0 && (
          <div className="shoppingDiv" id="shoppingdiv">
            {cartItems.map((item, pos) => {
              return (
                <tr key={pos}>
                  <td>
                    <Item {...item} />
                  </td>
                </tr>
              );
            })}
            <b>totaal: € {total}</b>
            <Button
              style={{ width: "15rem", marginTop: "1rem" }}
              onClick={() => handleOnClick()}
            >
              Checkout
            </Button>
          </div>
        )}
        {totalNumCartItems === 0 && (
          <div className="shoppingDiv" id="shoppingdiv">
            <br />
            <br />
            <span>{emptyCart}</span>
            <br />
            <br />
            <br />
          </div>
        )}
        <div className="overlay"></div>
        <div className="wrap">
          <div className="logo" onClick={() => removeCart()}>
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>

          <nav>
            <ul onClick={() => removeCart()}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/search">Search</Link>
              </li>
            </ul>
          </nav>

          <div className="callToActions">
            <ul>
              <li style={{ marginRight: "2.2rem" }}>
                <div
                  id="shoppincart"
                  className="shoppingcartWrap"
                  onClick={() => toggleCart()}
                >
                  <i class="fas fa-shopping-cart"></i>
                  {totalNumCartItems > 0 && (
                    <span className="cartTotal">{totalNumCartItems}</span>
                  )}
                </div>
              </li>

              {currentUser && [
                <li>
                  <Link to="/dashboard" onClick={() => removeCart()}>
                    My Account
                  </Link>
                </li>,
                <li>
                  <Link to="/" onClick={() => removeCart()}>
                    {" "}
                    <span onClick={() => signOut()}>Logout</span>
                  </Link>
                </li>,
              ]}

              {!currentUser && [
                <li>
                  <Link to="/registration" onClick={() => removeCart()}>
                    Register
                  </Link>
                </li>,
                <li>
                  <Link to="/login" onClick={() => removeCart()}>
                    Login
                  </Link>
                </li>,
              ]}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.defaultProps = {
  currentUser: null,
};

export default Header;

export const toggleCart = () => {
  const cart = document.getElementById("shoppingdiv");
  cart.classList.toggle("cart-active");
  toggleOverlay();
};

export const removeCart = () => {
  const cart = document.getElementById("shoppingdiv");
  cart.classList.remove("cart-active");
};

export const addCart = () => {
  const cart = document.getElementById("shoppingdiv");
  cart.classList.add("cart-active");
};

export const toggleOverlay = () => {
  const app = document.getElementById("page-overlay");
  if (app !== null) {
    app.classList.toggle("page-overlay-active");
  }
};
