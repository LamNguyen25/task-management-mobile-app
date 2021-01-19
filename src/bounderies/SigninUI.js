import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Button,
} from "react-native";
import { styles, colors } from "../styles/styles";
import User from "../entities/user";
import AuthController from "../controllers/AuthController";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";

export default class SigninUI extends React.Component {
  state = {
    email: "",
    password: "",
    errorMessage: null,
  };

  signinHandler = () => {
    let auth = new AuthController();
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        User.setEmail(this.state.email);
        User.setPassword(this.state.password);
        this.props.navigation.navigate("View Tasks");
      })
      .catch((error) =>
        this.setState({
          errorMessage: error.message,
        })
      );

    console.log(User.getEmail());
  };

  signupHandler = () => {
    this.props.navigation.navigate("Signup");
  };

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser) => {
    console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function (result) {
              console.log("user signed in");

              // Check if user signing in already exists in databae
              if (result.additionalUserInfo.isNewUser) {
                // To add user data into firebase
                firebase
                  .firestore()
                  .collection(result.user.uid)
                  .doc("profile")
                  .set({
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    locale: result.additionalUserInfo.profile.locale,
                    created_at: Date.now(),
                  });
              } else {
                firebase
                  .firestore()
                  .collection(result.user.uid)
                  .doc("profile")
                  .update({
                    last_logged_in: Date.now(),
                  });
              }
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log("User already signed-in Firebase.");
        }
      }.bind(this)
    );
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "340019352776-j5bntt18jr7k2dtruqignblqiav6o9sa.apps.googleusercontent.com",
        // iosClientId: YOUR_CLIENT_ID_HERE,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  forgotPasswordHandler = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  render() {
    return (
      <View style={(styles.container, styles.background)}>
        <SafeAreaView style={styles.container}>
          {/*****  ERROR SECTION  *************************/}
          <View style={styles.error}>
            <Text style={styles.errorMessage}> {this.state.errorMessage} </Text>
          </View>
          {/*****  FORM SECTION: email and password input, forgotpassword link, and Signin Button  *************************/}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              {/*****  Email input  *************************/}
              <TextInput
                style={styles.inputText}
                placeholder="Email"
                value={this.state.email}
                autoCapitalize="none"
                onChangeText={(email) =>
                  this.setState({
                    email,
                  })
                }
              />
              {/*****  Password input  *************************/}
              <TextInput
                style={styles.inputText}
                placeholder="Password"
                secureTextEntry
                value={this.state.password}
                autoCapitalize="none"
                onChangeText={(password) =>
                  this.setState({
                    password,
                  })
                }
              />
            </View>
            {/*****  Forgot password message and link  *************************/}
            <View style={styles.forgotPasswordContainer}>
              <Text>Forgot Password? </Text>
              <TouchableOpacity>
                <Text
                  style={{ color: colors.wildBlueYonder }}
                  onPress={() => {
                    this.forgotPasswordHandler();
                  }}
                >
                  CLICK HERE
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={this.signinHandler}
            >
              <Text style={styles.buttonText}> Sign In </Text>
            </TouchableOpacity>
          </View>
          {/*****  OTHER WAYS TO SIGNIN SECTION: message and buttons  *************************/}
          <View>
            <Text style={{ textAlign: "center", marginVertical: "5%" }}>
              {"OR\nSign in with"}
            </Text>
            <View style={styles.otherSigninButtons}>
              <TouchableOpacity
                style={styles.googleButton}
                onPress={() => {
                  this.signInWithGoogleAsync();
                }}
              >
                <Image
                  style={styles.googleIcon}
                  source={require("../assets/images/googleIcon400x400.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        {/*****  SIGN UP SECTION: message and sign up link  *************************/}
        <View style={styles.signupContainer}>
          <Text>Not a member? </Text>
          <TouchableOpacity onPress={this.signupHandler}>
            <Text style={{ color: colors.wildBlueYonder }}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
