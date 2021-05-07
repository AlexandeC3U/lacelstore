import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
} from "../../redux/Cart/cart.selectors";
import { createStructuredSelector } from "reselect";
import { firestore } from "../../firebase/utils";
import Button from "../../components/Forms/Button";
import FormInput from "../../components/Forms/FormInput";
import Item from "./Item";
import { Modal } from "./../../components/Modal";
import "./styles.scss";

const mapState = createStructuredSelector({
  cartItems: selectCartItems,
  total: selectCartTotal,
});

const useStateWithLocalStorage = (localStorageKey) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(localStorageKey) || ""
  );

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);

  return [value, setValue];
};

const Checkout = ({}) => {
  const [value, setValue] = useStateWithLocalStorage("coupon");
  const history = useHistory();
  const { cartItems, total } = useSelector(mapState);
  const [discount, setDiscount] = useState(0);
  const [hideModal, setHideModal] = useState(true);
  const [couponAccepted, setCouponAccepted] = useState(false);
  const emptyCart = "You have no items in your cart";
  const [kortingsData, setKortingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = firestore.collection("kortingcodes");

    const unsubscribe = docRef.onSnapshot((querySnapshot) => {
      const couponList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKortingsData(couponList);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (value !== "") {
      for (let i = 0; i < kortingsData.length; i++) {
        const ccode = kortingsData[i].code;
        if (value === ccode) {
          setDiscount(Number(kortingsData[i].name));
          setCouponAccepted(true);
          return;
        } else {
          setCouponAccepted(false);
          setDiscount(0);
        }
      }
    }
  });

  const toggleModal = () => {
    setHideModal(!hideModal);
  };

  const configModal = {
    hideModal,
    toggleModal,
  };

  const resetForm = () => {
    setHideModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValue(document.getElementById("couponcode").value);
    const couponCode = document.getElementById("couponcode").value;
    var couponFound = false;

    if (couponCode !== "") {
      for (let i = 0; i < kortingsData.length; i++) {
        const ccode = kortingsData[i].code;
        if (couponCode === ccode) {
          setDiscount(Number(kortingsData[i].name));
          setCouponAccepted(true);
          toggleModal();
          couponFound = true;
          return;
        } else {
          setCouponAccepted(false);
        }
      }
      if (!couponFound) window.alert("Coupon niet gevonden.");
      return;
    } else {
      window.alert("Deze code bestaat niet.");
    }
    resetForm();
  };

  setTimeout(() => {
    setLoading(false);
  }, 350);

  const formClassname = `${loading ? "loading" : ""}`;

  return (
    <div className="checkout">
      <div className={formClassname}>
        <h1>Checkout</h1>
        <br />
        <br />
        <Modal {...configModal}>
          <div className="addNewProductForm">
            <form onSubmit={handleSubmit}>
              <h2>Coupon toevoegen</h2>
              <span className="exit" onClick={() => toggleModal()}>
                X
              </span>
              <br />
              <FormInput label="Coupon code" type="text" id="couponcode" />

              <Button
                type="submit"
                style={{
                  width: "18rem",
                  marginTop: "2.5rem",
                  fontSize: "1.2rem",
                  background: "darkgrey",
                }}
              >
                Coupon toevoegen
              </Button>
            </form>
          </div>
        </Modal>

        {!loading && (
          <div className="cart">
            {cartItems.length > 0 ? (
              <table border="0" cellPadding="0" cellSpacing="0">
                <tbody style={{ textAlign: "center" }}>
                  <tr style={{ textAlign: "center", margin: "auto" }}>
                    <table
                      className="checkoutHeader"
                      border="0"
                      cellPadding="10"
                      cellSpacing="0"
                      style={{ textAlign: "center" }}
                    >
                      <tbody>
                        <tr>
                          <th>Product</th>
                          <th>Description</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Remove</th>
                        </tr>
                      </tbody>
                    </table>
                  </tr>
                  <tr>
                    <table border="0" cellSpacing="0" cellPadding="0">
                      <tbody>
                        {cartItems.map((item, pos) => {
                          return (
                            <tr key={pos}>
                              <td>
                                <Item {...item} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </tr>

                  <tr>
                    <table
                      algin="right"
                      border="0"
                      cellSpacing="0"
                      cellPadding="10"
                    >
                      <tr align="left">
                        <td>
                          <br />
                          <h3>Total: € {total - (total / 100) * discount}</h3>
                        </td>
                      </tr>

                      <tr>
                        <table border="0" cellSpacing="0" cellPadding="10">
                          <tbody>
                            <tr>
                              <td>
                                <Button onClick={() => history.goBack()}>
                                  Continue shopping
                                </Button>
                              </td>
                              <td>
                                {!couponAccepted && (
                                  <Button onClick={() => toggleModal()}>
                                    Add coupon
                                  </Button>
                                )}
                                {couponAccepted && (
                                  <Button onClick={() => setValue(0)}>
                                    Remove coupon
                                  </Button>
                                )}
                              </td>
                              <td>
                                <Button>Checkout</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </tr>
                    </table>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>{emptyCart}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
