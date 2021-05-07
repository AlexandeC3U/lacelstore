import React from "react";
import "./styles.scss";
import moment from "moment";
import { deleteCoupon } from "../../firebase/utils";

const Coupon = (coupon) => {
  const { name, code, startDate, endDate, id } = coupon;

  const dateStart = moment(startDate.toDate()).format("D / MM / YYYY");
  const dateEnd = moment(endDate.toDate()).format("D / MM / YYYY");

  const onDeleteCoupon = (couponID) => {
    try {
      deleteCoupon(couponID);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <table className="cartItem" border="0" cellSpacing="0" cellPadding="10">
      <tbody>
        <tr>
          <td>{name}%</td>
          <td>{code}</td>
          <td>{dateStart}</td>
          <td>{dateEnd}</td>
          <td align="center">
            <span className="coupon-remove" onClick={() => onDeleteCoupon(id)}>
              X
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Coupon;
