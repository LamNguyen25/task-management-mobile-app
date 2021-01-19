import React from "react";
import { colors, styles } from "../styles/styles";

import { View, Text, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class TaskSubButton extends React.Component {
  getIconName = () => {
    var iconName = "";
    this.props.type == "done"
      ? (iconName = "archive")
      : this.props.type == "not done"
      ? (iconName = "unarchive")
      : (iconName = this.props.type);
    return iconName;
  };

  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.onPress();
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "83%",
            width: "20%",
            marginTop: 11,
            borderRadius: 10,
            backgroundColor: this.props.color,
          }}
        >
          <Icon
            style={{ color: colors.white, marginBottom: 0, fontSize: 48 }}
            name={this.getIconName()}
          />
          <Text style={{ color: colors.white }}>{this.props.type}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
