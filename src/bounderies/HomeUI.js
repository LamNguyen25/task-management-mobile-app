import React from "react";
import { View, Text, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles, colors } from "../styles/styles";
import { Button as PaperButton } from "react-native-paper";
import { logoutUser } from "../controllers/AuthController";
import { Header } from "react-native-elements";
import ItemController from "../controllers/ItemController";

export default class HomeUI extends React.Component {
  async componentDidMount() {
    await new ItemController().downloadAllTasks();
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon
          name={"magnify"}
          style={styles.searchIcon}
          onPress={() => {
            console.log("search");
          }}
        />

        <Text>Home UI Screen</Text>
        <PaperButton
          onPress={() => this.props.navigation.navigate("AddItems")}
          title="Add Item"
          color={colors.mediumTurquoise}
          mode="contained"
        >
          Add Task
        </PaperButton>
      </View>
    );
  }
}
