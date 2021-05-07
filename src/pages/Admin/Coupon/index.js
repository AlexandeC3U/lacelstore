import React, { useState, useEffect } from "react";
import "./styles.scss";
import Coupon from "../../../components/Coupon";
import { firestore, addCoupon } from "../../../firebase/utils";
import { Modal } from "./../../../components/Modal";
import Button from "../../../components/Forms/Button";
import FormInput from "../../../components/Forms/FormInput";
import moment from "moment";

const CouponCode = () => {
  const [coupons, setCoupons] = useState([]);
  const [hideModal, setHideModal] = useState(true);
  const [code, setCouponCode] = useState("");
  const [name, setCouponName] = useState("");
  const [couponEndDate, setCouponEndDate] = useState("");

  useEffect(() => {
    const docRef = firestore.collection("kortingcodes").orderBy("startDate");

    const unsubscribe = docRef.onSnapshot((querySnapshot) => {
      const couponList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCoupons(couponList);
    });
    return unsubscribe;
  }, []);

  const resetForm = () => {
    setHideModal(true);
    setCouponCode("");
    setCouponName("");
    setCouponEndDate("");
  };

  const toggleModal = () => {
    setHideModal(!hideModal);
  };

  const configModal = {
    hideModal,
    toggleModal,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = new Date();
    const endDate = new Date(couponEndDate);
    const coupon = { name, code, startDate, endDate };

    console.log(coupon);
    try {
      addCoupon(coupon);
    } catch (e) {
      console.log(e);
    }
    resetForm();
  };

  return (
    <div class="coupon">
      <h2>Kortingscodes</h2>
      <Button
        onClick={() => toggleModal()}
        style={{ width: "25rem", margin: "0" }}
      >
        Coupon toevoegen
      </Button>
      <br />
      <div>
        <Modal {...configModal}>
          <div className="addNewProductForm">
            <form onSubmit={handleSubmit}>
              <h2>Kortingscode toevoegen</h2>
              <span className="exit" onClick={() => toggleModal()}>
                X
              </span>

              <label>
                Korting %
                <FormInput
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  handleChange={(e) => setCouponName(e.target.value)}
                />
              </label>

              <label>
                Coupon code
                <FormInput
                  type="text"
                  handleChange={(e) => setCouponCode(e.target.value)}
                />
              </label>

              <label>
                Einddatum
                <FormInput
                  type="date"
                  min={moment(new Date()).format("yyyy-MM-DD")}
                  handleChange={(e) => setCouponEndDate(e.target.value)}
                />
              </label>
              <Button type="submit" style={{ marginTop: "3rem", width: "60%" }}>
                Nieuwe coupon toevoegen
              </Button>
            </form>
          </div>
        </Modal>
      </div>
      <div className="cart">
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
                    <th>Korting</th>
                    <th>Code</th>
                    <th>Startdatum</th>
                    <th>Einddatum</th>
                    <th>Remove</th>
                  </tr>
                </tbody>
              </table>
            </tr>
            <tr>
              <table border="0" cellSpacing="0" cellPadding="0">
                <tbody>
                  {coupons.map((item, pos) => {
                    return (
                      <tr className="coupon-data" key={pos}>
                        <td className="coupon-row">
                          <Coupon {...item} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponCode;
