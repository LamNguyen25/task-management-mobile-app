import React from "react";
import DatabaseUI from "../bounderies/DatabaseUI";
import { Alert} from 'react-native';
import Item from "../entities/item";

export default class UserController extends React.Component {
  getUser = () => DatabaseUI.getCurrentUser();
  
  getUserID = () => DatabaseUI.getCurrentUser().getUid();

  signInWithEmailAndPassword = (email, password) => {
    return DatabaseUI.signInWithEmailAndPassword(email, password);
  };
  changeEmailTo = (newEmail) => {
    return DatabaseUI.changeEmailTo(newEmail);
  };
  signOut = () => {
    DatabaseUI.signOut();
  };
  sendPasswordResetEmail = (email) => DatabaseUI.sendPasswordResetEmail(email);

  confirmPasswordReset = (code, newPassword) =>
    firebase.auth.Auth.confirmPasswordReset(code, newPassword);

  addTask = (Item) => {
    return DatabaseUI.addTask(Item);
  };
}
