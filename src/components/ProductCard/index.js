import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductStart,
  setProduct,
} from "./../../redux/Products/products.actions";
import { addProduct } from "./../../redux/Cart/cart.actions";
import Button from "./../Forms/Button";
import "./styles.scss";

const mapState = (state) => ({
  product: state.productsData.product,
});

const ProductCard = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { productID } = useParams();
  const { product } = useSelector(mapState);

  const {
    productThumbnail,
    productName,
    productPrice,
    productDesc,
    productInUse,
  } = product;

  useEffect(() => {
    dispatch(fetchProductStart(productID));

    return () => {
      dispatch(setProduct({}));
    };
  }, []);

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

  const configAddToCartBtn = {
    type: "button",
  };

  return (
    <div className="productCard">
      <div className="hero">
        <img src={productThumbnail} />
      </div>
      <div className="productDetails">
        <ul>
          <li>
            <h1>{productName}</h1>
          </li>
          <li>
            <span>€ {productPrice}</span>
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
            </div>
            {!productInUse && (
              <Button
                style={{
                  width: "300px",
                  cursor: "default",
                  background: "grey",
                }}
              >
                Product niet beschikbaar
              </Button>
            )}
          </li>
          <li>
            <span
              className="desc"
              dangerouslySetInnerHTML={{ __html: productDesc }}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductCard;
