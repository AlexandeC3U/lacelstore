import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addProductStart,
  deleteProductStart,
} from "./../../redux/Products/products.actions";
import { Modal, Modal2 } from "./../../components/Modal";
import FormInput from "./../../components/Forms/FormInput";
import FormSelect from "./../../components/Forms/FormSelect";
import Button from "./../../components/Forms/Button";
import { useHistory } from "react-router-dom";
import CKEditor from "ckeditor4-react";
import MaterialTable from "material-table";
import { updateProduct, firestore } from "../../firebase/utils";
import "./styles.scss";

const Admin = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [hideModal, setHideModal] = useState(true);
  const [hideModal2, setHideModal2] = useState(true);
  const [productCategory, setProductCategory] = useState("mens");
  const [productName, setProductName] = useState("");
  const [productThumbnail, setProductThumbnail] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productDesc, setProductDesc] = useState("");
  const [productInUse, setProductInUse] = useState(true);
  const [data, setData] = useState([]);
  const [productToDelete, setProductToDelete] = useState("");

  useEffect(() => {
    const docRef = firestore.collection("products").orderBy("createdDate");

    const unsubscribe = docRef.onSnapshot((querySnapshot) => {
      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(productsList);
    });
    return unsubscribe;
  }, []);

  const toggleModal = () => {
    setHideModal(!hideModal);
  };
  const toggleModal2 = (productID) => {
    setProductToDelete(productID);
    setHideModal2(!hideModal2);
  };

  const configModal = {
    hideModal,
    toggleModal,
  };

  const configModal2 = {
    hideModal2,
    toggleModal2,
  };

  const resetForm = () => {
    setHideModal(true);
    setHideModal2(true);
    setProductCategory("mens");
    setProductName("");
    setProductThumbnail("");
    setProductPrice(0);
    setProductDesc("");
    setProductInUse(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      addProductStart({
        productCategory,
        productName,
        productThumbnail,
        productPrice,
        productDesc,
        productInUse,
      })
    );
    resetForm();
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();

    console.log(e);

    dispatch(deleteProductStart(productToDelete));
    resetForm();
  };

  const onCheckboxChange = async (data) => {
    try {
      if (data.productInUse === true) {
        data.productInUse = false;
      } else if (data.productInUse === false) {
        data.productInUse = true;
      }
      console.log(data);
      await updateProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin">
      <div className="callToActions">
        <ul>
          <li>
            <Button onClick={() => toggleModal()}>Product toevoegen</Button>
          </li>
        </ul>
      </div>

      <Modal {...configModal}>
        <div className="addNewProductForm">
          <form onSubmit={handleSubmit}>
            <h2>Product toevoegen</h2>
            <span className="exit" onClick={() => toggleModal()}>
              X
            </span>
            <FormSelect
              label="Categorie"
              options={[
                {
                  value: "mens",
                  name: "Mens",
                },
                {
                  value: "womens",
                  name: "Womens",
                },
              ]}
              handleChange={(e) => setProductCategory(e.target.value)}
            />

            <FormInput
              label="Productnaam"
              type="text"
              value={productName}
              handleChange={(e) => setProductName(e.target.value)}
            />

            <FormInput
              label="Afbeelding url"
              type="url"
              value={productThumbnail}
              handleChange={(e) => setProductThumbnail(e.target.value)}
            />

            <FormInput
              label="Productprijs"
              type="number"
              min="0.00"
              max="10000.00"
              step="0.01"
              value={productPrice}
              handleChange={(e) => setProductPrice(e.target.value)}
            />

            <CKEditor
              onChange={(evt) => setProductDesc(evt.editor.getData())}
            />

            <br />

            <Button type="submit">Nieuw product toevoegen</Button>
          </form>
        </div>
      </Modal>

      <Modal2 {...configModal2}>
        <div className="addNewProductForm">
          <form onSubmit={handleSubmit2}>
            <h2>Product verwijderen</h2>
            <span className="exit" onClick={() => toggleModal2()}>
              X
            </span>
            <br />
            <br />
            <p>Bent u zeker dat u dit product definitief wilt verwijderen ?</p>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Button type="submit">Product verwijderen</Button>
          </form>
        </div>
      </Modal2>

      <div className="products-table">
        <br />
        <br />
        <MaterialTable
          title=""
          data={data}
          columns={[
            {
              title: "product afbeelding",
              field: "productThumbnail",
              sorting: false,
              filtering: false,
              render: (rowData) => (
                <img
                  src={rowData.productThumbnail}
                  alt={productName}
                  className="table-img"
                />
              ),
            },
            {
              title: "productnaam",
              field: "productName",
              sorting: false,
            },
            {
              title: "productcategory",
              field: "productCategory",
              lookup: {
                mens: "mannen",
                womens: "vrouwen",
              },
            },
            {
              title: "productprijs",
              field: "productPrice",
              render: (rowData) => <span>€ {rowData.productPrice}</span>,
            },
            {
              title: "beschikbaarheid",
              field: "productInUse",
              lookup: {
                true: "Beschikbaar",
                false: "Niet beschikbaar",
              },
              render: (rowData) => (
                <label className="switch">
                  <input
                    type="checkbox"
                    defaultChecked={rowData.productInUse}
                    onChange={() => onCheckboxChange(rowData)}
                  />
                  <span className="slider round"></span>
                </label>
              ),
            },
            {
              title: "Acties",
              field: "",
              sorting: false,
              filtering: false,
              render: (rowData) => (
                <div
                  className="btn-wrapper"
                  style={{
                    display: "flex",
                    textAlign: "center",
                    margin: "auto",
                  }}
                >
                  <button
                    style={{ width: "auto" }}
                    className="table-btn table-btn-edit"
                    onClick={() => history.push(`/edit/${rowData.id}`)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    style={{ width: "auto" }}
                    className="table-btn table-btn-delete"
                    onClick={() => toggleModal2(rowData.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ),
            },
          ]}
          options={{
            search: true,
            exportAllData: true,
            filtering: true,
            exportButton: false,
            pageSizeOptions: [5, 10, 20, 25, 50, 100],
            emptyRowsWhenPaging: false,
            paging: true,
            pageSize: 5,
          }}
        />
      </div>
    </div>
  );
};

export default Admin;
