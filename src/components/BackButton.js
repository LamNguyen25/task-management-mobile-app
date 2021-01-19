import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "../styles/styles";

/** Usage: <BackButton navigation={props.navigation} /> */
export default class BackButton extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
        <Icon name="chevron-left" style={styles.backIcon} />
      </TouchableOpacity>
    );
  }
}
