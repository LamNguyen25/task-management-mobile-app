import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

export default class AccOptionRow extends React.Component {
  render() {
    return (
      <View style={styles.accountOptionsRow}>
        <MaterialCommunityIcons
                    name={this.props.icon}
                    style = {styles.bullet}
                    // color="blue"
                  />
        {/* <Text style={styles.bullet}>{"\u2022"}</Text> */}
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={styles.textRow}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
