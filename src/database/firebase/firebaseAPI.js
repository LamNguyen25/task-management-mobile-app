import React from "react";
import { firebaseConfig } from "./firebaseConfig";
import * as firebase from "firebase";
import "@firebase/firestore";

import Item from "../../entities/item";

class firebaseAPI extends React.Component {
  static instance = firebaseAPI.instance || new firebaseAPI();

  initializeApp = () => {
    if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
  };

  onAuthStateChanged = (user) => firebase.auth().onAuthStateChanged(user);

  signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  createUserWithEmailAndPassword = (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  signOut = () => firebase.auth().signOut();

  getCurrentUser = () => firebase.auth().currentUser;

  getAuthCredential = () => {
    return firebase.auth().userCredential.credential;
  };

  deleteAccount = () => this.getCurrentUser().delete();

  sendPasswordResetEmail = (email) =>
    firebase.auth().sendPasswordResetEmail(email);

  confirmPasswordReset = (code, newPassword) =>
    firebase.auth().confirmPasswordReset(code, newPassword);

  resetPassword = (password) => this.getCurrentUser().updatePassword(password);

  changeEmailTo = (newEmail) => this.getCurrentUser().updateEmail(newEmail);

  addTask = (Item) => {
    firebase
      .firestore()
      .collection(this.getCurrentUser().uid)
      .doc()
      .withConverter(Item.mConverter)
      .set(Item);
  };

  getCollectionRef = (collection) =>
    firebase.firestore().collection(collection);

  getStorage = () => firebase.storage();
}

export default database = firebaseAPI.instance;
