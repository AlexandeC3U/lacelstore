import React, { useState, useEffect } from "react";
import { firestore, updateProduct } from "../../../firebase/utils";
import { useParams, useHistory } from "react-router-dom";
import CKEditor from "ckeditor4-react";
import {
  fetchProductStart,
  setProduct,
} from "./../../../redux/Products/products.actions";
import Button from "./../../../components/Forms/Button";
import FormInput from "./../../../components/Forms/FormInput";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../assets/loader.gif";

const mapState = (state) => ({
  product: state.productsData.product,
});

const EditProduct = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { productID } = useParams();
  const { product } = useSelector(mapState);
  const [productDescr, setProductDescr] = useState(null);
  const [loading, setLoading] = useState(true);

  var {
    productThumbnail,
    productName,
    productPrice,
    productCategory,
    productDesc,
    productAdminUserUID,
    productInUse,
  } = product;

  console.log(product);

  useEffect(() => {
    dispatch(fetchProductStart(productID));

    return () => {
      dispatch(setProduct({}));
      setLoading(false);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productName = document.getElementById("productnaam").value;
    const productPrice = document.getElementById("productprijs").value;
    const productCategory = document.getElementById("productcategorie").value;
    const productThumbnail = document.getElementById("producturl").value;
    var productDescription = "";

    if (productDescr === null) {
      productDescription = productDesc;
    } else {
      productDescription = productDescr;
    }

    productDesc = productDescription;
    const id = productID;

    const productData = {
      productName,
      productPrice,
      productCategory,
      productThumbnail,
      productDesc,
      id,
      productAdminUserUID,
      productInUse,
    };
    console.log(productData);

    try {
      await updateProduct(productData);
    } catch (error) {
      console.log(error);
    } finally {
      history.push("/admin");
    }
  };

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  const formClassname = `${loading ? "loading" : ""}`;

  return (
    <div>
      <h2>Edit product:</h2>
      <div>
        <form className={formClassname} onSubmit={handleSubmit}>
          {!loading && (
            <div style={{ justifyContent: "center", marginTop: "30px" }}>
              <div>
                <FormInput
                  id="productnaam"
                  label="Productnaam"
                  type="text"
                  required="required"
                  defaultValue={productName}
                />
              </div>

              <div style={{ paddingBottom: "1rem" }}>
                <FormInput
                  id="productprijs"
                  label="Productprijs"
                  type="text"
                  required="required"
                  defaultValue={productPrice}
                />
              </div>

              <label>
                Categorie
                <br />
                <br />
                <select
                  style={{ display: "block", border: "none", outline: "none" }}
                  id="productcategorie"
                  name="productCategory"
                  htmlFor="productCategorie"
                  required
                  defaultValue={productCategory}
                >
                  <option value="mens">Mens</option>
                  <option value="womens">Womens</option>
                </select>
              </label>

              <div style={{ paddingTop: "2rem" }}>
                <FormInput
                  id="producturl"
                  label="Producturl"
                  type="Url"
                  name="productThumbnail"
                  required="required"
                  defaultValue={productThumbnail}
                />
              </div>

              <div style={{ paddingTop: "1rem" }}>
                <CKEditor
                  id="productdesc"
                  data={productDesc}
                  name="productDesc"
                  htmlFor="productDesc"
                  onChange={(evt) => setProductDescr(evt.editor.getData())}
                />
              </div>
              <br />
              <Button type="submit">Submit</Button>
            </div>
          )}
          {loading && <img class="loader" src={Loader} />}
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
