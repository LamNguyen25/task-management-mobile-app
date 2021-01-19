import React from "react";
import { View, Text } from "react-native";
import {styles} from "../styles/styles"

export default class SettingsUI extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Settings UI Screen</Text>
      </View>
    );
  }
}

