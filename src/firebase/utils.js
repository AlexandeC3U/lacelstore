import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { firebaseConfig } from "./config";

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const GoogleProvidor = new firebase.auth.GoogleAuthProvider();
GoogleProvidor.setCustomParameters({ prompt: "select_account" });

export const handleUserProfile = async ({ userAuth, additionalData }) => {
  if (!userAuth) return;
  const { uid } = userAuth;

  const userRef = firestore.doc(`users/${uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email } = userAuth;
    const timestamp = new Date();
    const userRoles = ["user"];

    try {
      await userRef.set({
        displayName,
        email,
        createDate: timestamp,
        userRoles,
        ...additionalData,
      });
    } catch (e) {
      console.log(e);
    }
  }
  return userRef;
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export const updateProduct = async (product) => {
  const docRef = firestore.doc(`/products/${product.id}`);
  return docRef.update(product);
};

export const addCoupon = async (coupon) => {
  const docRef = firestore.collection("/kortingcodes");
  return docRef.add(coupon);
};

export const deleteCoupon = async (couponID) => {
  const docRef = firestore.collection("/kortingcodes").doc(couponID);
  return docRef.delete();
};
