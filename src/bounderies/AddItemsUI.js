import React from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, Alert, ScrollView} from 'react-native';
import { colors, styles } from "../styles/styles";
import UserController from "../controllers/UserController";
import Item from "../entities/item";




export default class AddItemsUI extends React.Component{
  state = { newTask: "", newDueDate: "", newDescription: "", height: 40, errorMessage: null };
  goBackHandler = () => {
    this.props.navigation.navigate("Home");
  };

  addTask = () => {
    let user = new UserController();
    Item.setIsArchived(false);
    Item.setReminderDate("");
    Item.setparentID("");
    Item.setAttachmentURL("");
    Item.setPossiblePts(-1);
    Item.setRcvPts(-1);
    Item.setWeight(0);
    user.addTask(Item);
  };

  updateSize = (height) => {
    this.setState({
      height
    });
  }
  render() {
    const {newDescription, height} = this.state;
    let newStyle = {
      height
    }
    return (

      <View style={styles.container}>
        <ScrollView>
        <View style={[styles.error, { marginTop: "-30%" }]}>
          <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
        </View>

        <View style={[styles.form, { paddingTop: "20%"}]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Enter new task name here!"
              autoCapitalize="none"
              onChangeText={(newTask) => Item.setName(newTask)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="Due date: MM-DD-YYYY"
              autoCapitalize="none"
              onChangeText = {(newDueDate) => Item.setDueDate(newDueDate)}
            />
          </View>
          <View style={styles.inputContainer}>
          <TextInput
              style={[styles.myStyle, {borderBottomColor: colors.boarderInput},
                {borderBottomWidth: StyleSheet.hairlineWidth},
                {fontSize: 15},
                {textAlign: "center"}]}
              placeholder="Enter description here!"
              autoCapitalize="none"
              multiline={true}
              onChangeText={(newDescription) => Item.setDescription(newDescription)}

              onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
          />
          </View>
          <View style={{ flexDirection: "row", marginTop: "20%" }}>
              <View style={{ width: "80%" }}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.warning }]}
                  onPress={this.addTask}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: "10%" }}></View>
              <View style={{ width: "30%" }}>
                <TouchableOpacity
                  style={[styles.button]}
                  onPress={this.goBackHandler}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View></ScrollView>
      </View>
    );
  }
}