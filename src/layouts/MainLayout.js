import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = (props) => {
  return (
    <div className="page-overlay" id="page-overlay">
      <Header {...props} />
      <div className="main" id="main">
        {props.children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
