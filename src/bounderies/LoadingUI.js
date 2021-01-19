import React from "react";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { styles } from "../styles/styles";
import DatabaseUI from "./DatabaseUI";

// Uncomment this line if you want to disable the yellow warnings that are displayed
// Comment this line if you want to see the yellow warnings
console.disableYellowBox = true;

export default class LoadingUI extends React.Component {
  componentDidMount() {
    DatabaseUI.onAuthStateChanged((user) => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading UI Screen</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
