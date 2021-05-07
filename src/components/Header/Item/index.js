import React from "react";
import { useDispatch } from "react-redux";
import {
  removeCartItem,
  addProduct,
  reduceCartItem,
} from "../../../redux/Cart/cart.actions";

const Item = (product) => {
  const dispatch = useDispatch();
  const {
    productName,
    productThumbnail,
    productPrice,
    quantity,
    documentID,
  } = product;

  const handleRemoveCartItem = (documentID) => {
    dispatch(
      removeCartItem({
        documentID,
      })
    );
  };

  const handleAddProduct = (product) => {
    dispatch(addProduct(product));
  };

  const handleReduceItem = (product) => {
    dispatch(reduceCartItem(product));
  };

  return (
    <div className={"itemwrapper"}>
      <div className="img">
        <img src={productThumbnail} alt={productName} />
      </div>
      <div>
        <div>
          <span style={{ paddingLeft: "1rem" }}>{productName}</span>
        </div>
        <div className="itemsdetails">
          <span>€ {productPrice}</span>
          <div
            style={{
              display: "inline-block",
              marginLeft: "2rem",
              background: "white",
              border: "2px solid black",
              padding: ".3rem",
            }}
          >
            <span
              className="cartBtn cartLess"
              style={{ cursor: "pointer" }}
              onClick={() => handleReduceItem(product)}
            >
              <i class="fas fa-minus"></i>
            </span>
            <span
              className="cartQuantity"
              style={{ padding: ".5rem", cursor: "default" }}
            >
              {quantity}
            </span>
            <span
              className="cartBtn cartMore"
              style={{ cursor: "pointer" }}
              onClick={() => handleAddProduct(product)}
            >
              <i class="fas fa-plus"></i>
            </span>
          </div>
          <b
            className="cartBtn"
            style={{ marginLeft: "2rem", cursor: "pointer" }}
            onClick={() => handleRemoveCartItem(documentID)}
          >
            X
          </b>
        </div>
      </div>
    </div>
  );
};

export default Item;
