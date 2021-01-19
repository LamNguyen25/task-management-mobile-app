import React from "react";
const { TouchableOpacity } = require("react-native-gesture-handler");
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "../styles/styles";

export default class SearchButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.homeSearchIconContainer}
        onPress={() => this.props.navigation.navigate("Search")}
      >
        <Icon name={"magnify"} style={styles.searchIcon} />
      </TouchableOpacity>
    );
  }
}
