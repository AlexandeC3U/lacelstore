import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOutUserStart } from "../../redux/User/user.actions";
import { selectCartItemsCount } from "../../redux/Cart/cart.selectors";
import Logo from "../../assets/logo.png";
import { Link, useHistory } from "react-router-dom";

const mapState = (state) => ({
  currentUser: state.user.currentUser,
  totalNumCartItems: selectCartItemsCount(state),
});

const HeaderDb = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentUser, totalNumCartItems } = useSelector(mapState);

  const signOut = () => {
    dispatch(signOutUserStart());
  };

  return (
    <header className="header">
      <div className="container">
        <div className="wrap">
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>

          <nav>
            <ul>
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
                  onClick={() => history.push("/cart")}
                >
                  <i class="fas fa-shopping-cart"></i>
                  {totalNumCartItems > 0 && (
                    <span className="cartTotal">{totalNumCartItems}</span>
                  )}
                </div>
              </li>

              {currentUser && [
                <li>
                  <Link to="/dashboard">My Account</Link>
                </li>,
                <li>
                  <Link to="/">
                    {" "}
                    <span onClick={() => signOut()}>Logout</span>
                  </Link>
                </li>,
              ]}

              {!currentUser && [
                <li>
                  <Link to="/registration">Register</Link>
                </li>,
                <li>
                  <Link to="/login">Login</Link>
                </li>,
              ]}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

HeaderDb.defaultProps = {
  currentUser: null,
};

export default HeaderDb;
