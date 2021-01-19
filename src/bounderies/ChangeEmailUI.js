import React from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors, styles } from "../styles/styles";
import UserController from "../controllers/UserController";

export default class LoadingUI extends React.Component {
  state = { curEmail: "", newEmail: "", confirmEmail: "", errorMessage: null };

  goBackHandler = () => {
    this.props.navigation.navigate("Home");
  };

  changeEmailTo = () => {
    let user = new UserController();
    let userEmail = user.getUser().email.toLowerCase();
    let curEmail = this.state.curEmail.toLowerCase();

    userEmail === curEmail
      ? this.state.newEmail === this.state.confirmEmail
        ? user
            .changeEmailTo(this.state.newEmail)
            .then(() => {
              Alert.alert(
                "Success",
                "Email was changed to: " + this.state.confirmEmail
              );
              this.goBackHandler();
            })
            .catch((error) => this.setState({ errorMessage: error.message }))
        : this.setState({
            errorMessage: "The New and Confirm emails do not match",
          })
      : this.setState({
          errorMessage: "The entered email does not match our records.",
        });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.error, { marginTop: "-30%" }]}>
          <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
        </View>
        <View style={[styles.form, { paddingTop: "10%" }]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Enter Current Email"
              value={this.state.curEmail}
              autoCapitalize="none"
              onChangeText={(curEmail) => this.setState({ curEmail })}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Enter New Email"
              value={this.state.newEmail}
              autoCapitalize="none"
              onChangeText={(newEmail) => this.setState({ newEmail })}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Confirm New Email"
              value={this.state.confirmEmail}
              autoCapitalize="none"
              onChangeText={(confirmEmail) => this.setState({ confirmEmail })}
            />
            <View style={{ flexDirection: "row", marginTop: "20%" }}>
              <View style={{ width: "45%" }}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.warning }]}
                  onPress={this.changeEmailTo}
                >
                  <Text style={styles.buttonText}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: "10%" }}></View>
              <View style={{ width: "45%" }}>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={this.goBackHandler}
                >
                  <Text style={styles.buttonText}>CANCEL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
