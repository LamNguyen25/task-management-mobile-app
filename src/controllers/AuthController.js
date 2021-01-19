import React from "react";
import DatabaseUI from "../bounderies/DatabaseUI";
import firebase from "firebase/app";
import "firebase/auth";
import { EdgeInsetsPropType } from "react-native";


var actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  // Change to 'https://flantasking.firebaseapp.com' when the app is deployed
  url: 'https://localhost:3000/finishSignUp?cartId=1234',
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.ios.plantasking'
  },
  android: {
    packageName: 'com.flantasking',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'flantasking.page.link'
};

export default class AuthController extends React.Component {
  signInWithEmailAndPassword = (email, password) =>
    DatabaseUI.signInWithEmailAndPassword(email, password);
}

// Admin SDK API to generate the email verification link.
const emailVerification = (email) => {
  var displayName = firebase.auth().currentUser.displayName;
  console.log(displayName);
  firebase.auth().generateEmailVerificationLink(email, actionCodeSettings)
  .then((link) => {
    // Construct email verification template, embed the link and send
    // using custom SMTP server.
    console.log("Link was successfully sent");
    return sendVerificationEmail(email, displayName, link);
  })
  .catch((error) => {
    console.log(error);
    // Some error occurred, you can inspect the code: error.code
  });
}

// export const registerNewUser = async ({ name, email, password }) => {
//   await firebase.auth().createUserWithEmailAndPassword(email, password);
//   firebase
//     .auth()
//     .currentUser.updateProfile({
//       displayName: name,
//     })
//     .then(() => {
//       emailVerification(email);
//       return {};
//     })
//     .catch((error) => {
//       return { error: error.code };
//     });
// };

export const registerNewUser = async ({ name, email, password }) => {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(user) {

        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
          console.log("Email was sent")
          user.updateProfile({
            displayName: name,
          }).then(function() {
            firebase.firestore().collection(firebase.auth().currentUser.uid).doc('profile').set({
              first_name: name,
              last_name: "",
              email: email,
              profile_picture: null,
              locale: "en",
              created_at: Date.now(),
            })
            console.log("Display name was updated successfully", name)
          }).catch(function(error) {
            console.log(err)
          });
        }).catch(function(error) {
          console.log("Email was not sent")
        });
        
        

        return {};
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
        return { error: error.code };
      });
  };


export const getUserID = () => {
  return firebase.auth().currentUser.uid;
}

export const logoutUser = () => {
   firebase.auth().signOut();
   //DatabaseUI.signOut(); 
  
};

export const deleteUser = () => {
    var user = firebase.auth().currentUser;

    user.delete().then(function() {
        console.log("User was deleted successfully");
    }).catch(function(error) {
        return { error: error.code }
    });
}

export const sendPRemail = async (email) => {
  await firebase.auth().sendPasswordResetEmail(email);
};


