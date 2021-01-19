import React from "react";
const { TouchableOpacity } = require("react-native-gesture-handler");
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "../styles/styles";
import { DrawerActions } from "@react-navigation/native";

export default class HamburgerButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.dispatch(DrawerActions.toggleDrawer()); //toggles the menu
        }}
      >
        <Icon
          name={"menu"} //type of icon
          style={styles.menuIcon}
        />
      </TouchableOpacity>
    );
  }
}
