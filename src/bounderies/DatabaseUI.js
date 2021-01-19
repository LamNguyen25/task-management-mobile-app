import React from "react";
import database from "../database/firebase/firebaseAPI";
import Item from "../entities/item";

class DatabaseUI extends React.Component {
  static instance = DatabaseUI.instance || new DatabaseUI();

  getCurrentUser = () => database.getCurrentUser();

  initializeApp = () => {
    database.initializeApp();
  };

  onAuthStateChanged = (user) => database.onAuthStateChanged(user);

  signInWithEmailAndPassword = (email, password) =>
    database.signInWithEmailAndPassword(email, password);

  insertAccount = (email, password) =>
    database.createUserWithEmailAndPassword(email, password);

  signOut = () => database.signOut();

  getAuthCredential = () => {
    return database.getAuthCredential();
  };

  deleteAccount = () => {
    return database.deleteAccount();
  };
  changeEmailTo = (newEmail) => {
    return database.changeEmailTo(newEmail);
  };
  sendPasswordResetEmail = (email) => database.sendPasswordResetEmail(email);

  confirmPasswordReset = (code, newPassword) =>
    database.confirmPasswordReset(code, newPassword);

  addTask = (Item) => {
    return database.addTask(Item);
  };

  getCollectionRef = (collection) => database.getCollectionRef(collection);

  getStorage = () => database.getStorage();
}

export default DatabaseUI = DatabaseUI.instance;
