import React from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "./../../Forms/Button";
import { useDispatch } from "react-redux";
import { addProduct } from "./../../../redux/Cart/cart.actions";

const Product = (product) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    documentID,
    productThumbnail,
    productName,
    productPrice,
    productInUse,
  } = product;
  if (
    !documentID ||
    !productThumbnail ||
    !productName ||
    typeof productPrice === "undefined"
  )
    return null;

  const configAddToCartBtn = {
    type: "button",
  };

  const addCart = async () => {
    const cart = document.getElementById("shoppingdiv");
    console.log(cart);
    cart.classList.add("cart-active");
  };

  const toggleOverlay = () => {
    const app = document.getElementById("page-overlay");
    if (app !== null) {
      app.classList.add("page-overlay-active");
    }
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    dispatch(addProduct(product));
    setTimeout(() => {
      addCart();
      toggleOverlay();
    }, 350);
  };

  return (
    <div className="product">
      <div className="thumb">
        <Link to={`/product/${documentID}`}>
          <img src={productThumbnail} alt={productName} />
        </Link>
      </div>

      <div className="details">
        <ul>
          <li>
            <span className="name">
              <Link to={`/product/${documentID}`}>{productName}</Link>
            </span>
          </li>
          <li>
            <span className="price">€ {productPrice}</span>
          </li>
          <li>
            <div className="addToCart">
              {productInUse && (
                <Button
                  {...configAddToCartBtn}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to cart
                </Button>
              )}
              {!productInUse && (
                <Button
                  style={{
                    cursor: "default",
                  }}
                >
                  Product is niet beschikbaar
                </Button>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Product;
