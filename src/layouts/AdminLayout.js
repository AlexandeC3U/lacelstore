import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutUserStart } from "./../redux/User/user.actions";

import HeaderDb from "./../components/HeaderDb";
import VerticalNav from "./../components/VerticalNav";
import Footer from "./../components/Footer";

const AdminLayout = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const signOut = () => {
    dispatch(signOutUserStart());
    history.push("/");
  };

  return (
    <div className="adminLayout">
      <HeaderDb {...props} />
      <div className="controlPanel">
        <div className="sidebar">
          <VerticalNav>
            <ul>
              <li>
                <Link to="/admin">Products</Link>
              </li>
              <li>
                <Link to="/coupon">Coupons</Link>
              </li>
              <li>
                <span className="signOut" onClick={() => signOut()}>
                  Sign Out
                </span>
              </li>
            </ul>
          </VerticalNav>
        </div>
        <div className="content">{props.children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
