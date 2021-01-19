import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  TextInput,
  Platform,
  Keyboard,
  Button,
} from "react-native";
import { colors } from "../styles/styles";
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Item from "../entities/item";
import ItemController from "../controllers/ItemController";
import ItemDetailsUI from "../bounderies/ItemDetailsUI";
import WeightedItemDetailsUI from "../bounderies/WeightedItemDetailsUI";
import ReminderUI from "../bounderies/ReminderUI";
import GetAttachments from "./GetAttachments";
import LocalStorage from "../entities/LocalStorage";
import CalendarPicker from "react-native-calendar-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Permissions, Notifications } from "expo";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default class AddEditTask extends React.Component {
  state = {
    curTask: null,
    option: "",
    errorMessage: null,
    name: "",
    desc: "",
    weight: "",
    pssPts: "",
    parentId: "", // get parent ID if add a task from its parent
    isAddSubtaskClick: false,
    dueDate: null,
    reminderDate: null,
    mode: "date",
    show: false,
  };

  onDateChange = this.onDateChange.bind(this);
  newAttachment = null;

  onDateChange(date) {
    this.setState({
      dueDate: date,
    });
    LocalStorage.setDueDate(date);
  }

  getNameAndDescription = () => {
    return (
      <View key="nameNdescription">
        <Text style={styles.subTitle}>Name: </Text>
        <TextInput
          style={styles.inputText}
          placeholder="Enter new task name here!"
          placeholderTextColor={colors.white}
          autoCapitalize="none"
          value={this.state.name}
          onChangeText={(name) => {
            this.setState({ name });
            LocalStorage.setName(name);
          }}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Text style={styles.subTitle}>Description: </Text>
        <TextInput
          style={styles.inputText}
          placeholder="Enter description here!"
          placeholderTextColor={colors.white}
          autoCapitalize="none"
          multiline={true}
          value={this.state.desc}
          onChangeText={(desc) => {
            this.setState({ desc });
            LocalStorage.setDesc(desc);
          }}
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>
    );
  };
  getReminder = () => {
    var startDate = this.state.dueDate;
    if (!startDate || startDate == "none") {
      startDate = Date.now();
      console.log("date empty/null: " + startDate);
    }
    return (
      <View>
        <Text style={styles.subTitle}>Select date and time:</Text>
        <ReminderUI
          route={this.props.curTask}
          navigation={this.props.navigation}
          startDate={startDate}
          state={this.state}
          local={this.LocalStorage}
        />
      </View>
    );
  };

  getScale = () => {
    return (
      <View onPress={Keyboard.dismiss}>
        <Text style={styles.subTitle}>Weight: </Text>
        <TextInput
          style={styles.inputText}
          placeholder="Enter weight in Percent: 0 - 100"
          placeholderTextColor="#FFF"
          autoCapitalize="none"
          value={this.state.weight}
          onChangeText={(weight) => this.setState({ weight })}
          onSubmitEditing={Keyboard.dismiss}
        />
        <Text style={styles.subTitle}>Possible Points: </Text>
        <TextInput
          style={styles.inputText}
          placeholder="Enter a positive integer"
          placeholderTextColor="#FFF"
          autoCapitalize="none"
          multiline={true}
          value={this.state.pssPts}
          onChangeText={(pssPts) => this.setState({ pssPts })}
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>
    );
    /*
    return (
      <WeightedItemDetailsUI
        route={this.props.curTask}
        navigation={this.props.navigation}
      />
    );*/
  };

  getDueDate = () => {
    // const { selectedStartDate } = this.state;
    // const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const moment = require("moment");
    var dueDate = "none";
    if (this.state.dueDate) {
      dueDate = moment(new Date(this.state.dueDate)).format("MM-DD-YYYY");
      return (
        <View>
          <CalendarPicker
            selectedDayColor="white"
            onDateChange={this.onDateChange}
          />
          <View style={{ flexDirection: "row", paddingHorizontal: 5 }}>
            <Text style={styles.subTitle}>Due date: {dueDate}</Text>
            <TouchableOpacity onPress={() => this.clearDueDate()}>
              <MaterialCommunityIcons
                name="close-circle-outline"
                color="white"
                size={SCREEN_WIDTH * 0.07}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View>
        <CalendarPicker
          selectedDayColor="white"
          onDateChange={this.onDateChange}
        />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.subTitle}>Due date: none</Text>
        </View>
      </View>
    );
  };

  clearDueDate(date) {
    this.setState({
      dueDate: null,
    });
    LocalStorage.setDueDate(null);
  }

  getAttachment = () => {
    return (
      <GetAttachments
        task={this.props.curTask}
        isTaskPressed={this.props.isTaskPressed}
      />
    );
  };

  downloadTask = async () => {
    let tasks = await new ItemController().downloadTasks(
      "created_at",
      "==",
      this.props.curTask.created_at
    );
    let task = tasks[0];

    //if task is not null
    //or if the task
    if (
      !this.state.curTask ||
      task.created_at != this.state.curTask.created_at
    ) {
      this.setState({ curTask: task });
    } else {
      let count =
        task.attachmentURL.length - this.state.curTask.attachmentURL.length;
      if (count == 0) {
        for (i = 0; i < task.attachmentURL.length; ++i) {
          if (task.attachmentURL[i] != this.state.curTask.attachmentURL[i]) {
            this.setState({ curTask: task });
            return;
          }
        }
      } else {
        this.setState({ curTask: task });
      }
    }
  };

  getTaskDetails = () => {
    this.downloadTask();

    return (
      <ItemDetailsUI
        task={this.state.curTask ? this.state.curTask : this.props.curTask}
        navigation={this.props.navigation}
      />
    );
  };

  renderForm = () => {
    switch (LocalStorage.state.option) {
      case "reminder":
        return this.getReminder(); // change to reminder view function
        break;
      case "scale":
        return this.getScale(); // change to scale view function
        break;
      case "dueDate":
        return this.getDueDate(); // change to due date view function
        break;
      case "attachment":
        return this.getAttachment(); // change to attachment function
        break;
      default:
        //nameAndDescription case
        return this.props.isTaskPressed && !LocalStorage.state.isAddSubtaskClick
          ? this.getTaskDetails()
          : this.getNameAndDescription();
        break;
    }
  };

  toggleOption = (option) => {
    if (this.state.option == option) {
      this.setState({ option: "" });
      LocalStorage.state.option = "";
    } else {
      LocalStorage.state.option = option;
      this.setState({ option });
    }
  };

  getOptionButtons = () => {
    let style = { color: colors.taskShadow, fontSize: SCREEN_WIDTH * 0.1 };
    let centerRow = { flexDirection: "row", alignItems: "center" };
    let textStyle = {
      ...style,
      fontWeight: "500",
      fontSize: SCREEN_WIDTH * 0.055,
      marginLeft: -9,
    };

    let attButton = (
      <TouchableOpacity onPress={() => this.toggleOption("attachment")}>
        <MaterialCommunityIcons name="attachment" style={style} />
      </TouchableOpacity>
    );

    let dueDateButton = (
      <TouchableOpacity onPress={() => this.toggleOption("dueDate")}>
        <MaterialCommunityIcons name="calendar-clock" style={style} />
      </TouchableOpacity>
    );

    let scaleButton = (
      <TouchableOpacity onPress={() => this.toggleOption("scale")}>
        <MaterialCommunityIcons name="scale-balance" style={style} />
      </TouchableOpacity>
    );

    let reminderButton = (
      <TouchableOpacity onPress={() => this.toggleOption("reminder")}>
        <MaterialCommunityIcons name="bell-outline" style={style} />
      </TouchableOpacity>
    );

    let addSubTaskButton = (
      <TouchableOpacity
        style={centerRow}
        onPress={() => {
          this.addSubTaskMode();
        }}
      >
        <MaterialCommunityIcons name="plus" style={style} />
        <Text style={textStyle}>SubTask</Text>
      </TouchableOpacity>
    );

    let backButton = (
      <TouchableOpacity
        style={centerRow}
        onPress={() => {
          this.toggleOption("");

          if (LocalStorage.state.isAddSubtaskClick) {
            this.setState({ isAddSubtaskClick: false });
            LocalStorage.state.isAddSubtaskClick = false;
            LocalStorage.state.attachments = [];
          }
        }}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          style={{ ...style, fontWeight: "900" }}
        />
        <Text style={textStyle}>Back</Text>
      </TouchableOpacity>
    );

    return (
      <View style={styles.headerButtons}>
        <View style={{ ...centerRow, justifyContent: "flex-start" }}>
          {
            //LocalStorage.state.bsOption == "" &&
            !LocalStorage.state.isAddSubtaskClick ? null : backButton
          }
        </View>
        <View style={{ ...centerRow, justifyContent: "flex-end" }}>
          {attButton}
          {this.props.isTaskPressed && !LocalStorage.state.isAddSubtaskClick
            ? addSubTaskButton
            : [dueDateButton, scaleButton, reminderButton]}
        </View>
      </View>
    );
  };

  addTask = async () => {
    console.log("enter add Task");

    let user = new ItemController();

    let weight = this.state.weight == "" ? -1 : Number(this.state.weight);
    let pssPts = this.state.pssPts == "" ? -1 : Number(this.state.pssPts);

    if (this.state.name == "") {
      Alert.alert("Error", "Name is required");
      console.log("Error");
    } else if (weight < -1 || weight > 100) {
      Alert.alert("Error", "Weight can only be between 0 and 100");
    } else if (pssPts < -1) {
      Alert.alert(
        "Error",
        "Max Possible Points can only be greater or equal than 0"
      );
    } else {
      let date = Date.now().toString();

      Item.setName(this.state.name);
      Item.setDescription(this.state.desc);
      Item.setWeight(weight);
      Item.setPossiblePts(pssPts);
      Item.setCreatedAt(date);

      // If the new task is subtask, add its parent ID
      if (LocalStorage.state.isAddSubtaskClick) {
        Item.setparentID(this.props.curTask.id);
        LocalStorage.state.isAddSubtaskClick = false;
      }

      // setting due date
      const moment = require("moment");
      let dueDate = "";

      if (this.state.dueDate) {
        dueDate = moment(new Date(this.state.dueDate)).format("MM-DD-YYYY");
      }

      Item.setDueDate(dueDate);

      Item.setReminderDate(LocalStorage.getReminderDate());
      Item.setReminderTime(LocalStorage.getReminderTime());

      user.addTask(Item);
      Alert.alert(
        "Success",
        "task '" + Item.getName() + "' was successfully added"
      );
      Item.reset();
      this.setState({
        option: "",
        errorMessage: null,
        name: "",
        desc: "",
        weight: "",
        pssPts: "",
        parentId: "", // get parent ID if add a task from its parent
        isAddSubtaskClick: false,
        dueDate: null,
      });
      this.props.onRefresh();
      this.props.toggleBS();

      this.uploadAttachments(date);
    }
  };

  uploadAttachments = async (date) => {
    let atts = LocalStorage.state.attachments;
    //reference to newly added task
    const newTaskRef = new ItemController()
      .getTaskCollectionRef()
      .where("created_at", "==", date);

    while (atts.length > 0) {
      let att = atts.pop();

      if (att.name) {
        this.newAttachment = att.name;
      }

      //create blob from attachment
      let blob = await this.createBlob(att.uri);

      //uploads blob(attachment) to database
      let url = await this.uploadBlob(blob, date);

      if (url) {
        //adds url to newly added task's attachmentURL
        await this.addAttachmentURL(newTaskRef, this.newAttachment)
          .then(() => {
            Alert.alert("Success", "A new attachment was uploaded.");
          })
          .catch((error) => {
            Alert.alert(
              "Error",
              "There was an error while uploading an attachment.\n" + error
            );
          });
        this.newAttachment = null;
      }
    }
    downloadTask();
  };

  uploadAttachmentsButton = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors.vividSkyBlue,
          width: "42%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: "5%",
          left: "35%",
          borderRadius: 40,
        }}
        onPress={() => {
          this.uploadAttachments(this.props.curTask.created_at);
          LocalStorage.state.attachments = [];
          this.setState({ option: "" });
          Alert.alert("Uploading", "new Attachment is being uploaded.");
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: SCREEN_WIDTH * 0.045,
          }}
        >
          Upload
        </Text>
      </TouchableOpacity>
    );
  };
  //adds newURL to a task's attachmentURL
  addAttachmentURL = async (taskRef, newURL) => {
    let user = new ItemController();
    await taskRef.get().then(async (collection) => {
      await collection.docs.map((doc) => {
        console.log("added attachment");
        let attachmentURL = [...doc.data().attachmentURL, newURL];
        user.getTaskCollectionRef().doc(doc.id).update({ attachmentURL });
      });
    });
  };

  //uploads attachment(blob) to firebase storage
  //returns attachment's url
  uploadBlob = async (blob, date) => {
    let created_at = Date.now().toString();
    let user = new ItemController();
    let storageRef = user.getStorageRef(date).child(created_at);

    const snap = await storageRef.put(blob);

    blob.close();

    let url = user
      .getStorage()
      .ref(snap.metadata.fullPath)
      .getDownloadURL()
      .then((downloadURL) => {
        if (!this.newAttachment) {
          this.newAttachment = created_at;
        }
        this.newAttachment += "**/**" + created_at + "**/**" + downloadURL;

        return downloadURL;
      });

    return url;
  };

  //returns a blob( wrapped attachment ), which is ready to be uploaded
  createBlob = async (uri) => {
    let blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = () => {
        // something went wrong
        reject(new TypeError("uriToBlob failed"));
      };
      // this helps us get a blob
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);

      xhr.send(null);
    });
    return blob;
  };

  // Hide ItemDetails page and show add subtask field
  addSubTaskMode = () => {
    this.setState({ isAddSubtaskClick: true });
    LocalStorage.state.isAddSubtaskClick = true;
  };

  addTaskSubTaskButton = () => {
    return (
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => {
          this.addTask();
        }}
      >
        <Entypo name="add-to-list" color="#ade8f4" size={SCREEN_WIDTH * 0.07} />
      </TouchableOpacity>
    );
  };

  render() {
    const { dueDate } = this.state;
    this.state.dueDate = dueDate ? dueDate.toString() : "";

    let height =
      this.props.isTaskPressed || Platform.OS == "ios" ? "82%" : null;
    console.log("reset status: " + LocalStorage.getResetStatus());

    if (LocalStorage.getResetStatus()) {
      this.setState({
        option: "",
        errorMessage: null,
        name: "",
        desc: "",
        weight: "",
        pssPts: "",
        parentId: "", // get parent ID if add a task from its parent
        isAddSubtaskClick: false,
        dueDate: null,
      });
    }
    LocalStorage.setResetStatus(false);

    return (
      <View style={styles.panel}>
        <Text
          style={{
            alignSelf: "center",
            color: colors.white,
            fontSize: 20,
            fontWeight: "bold",
            marginTop: -15,
          }}
        >
          {this.props.isTaskPressed
            ? LocalStorage.state.isAddSubtaskClick
              ? "Adding Subtask"
              : "Task Details"
            : "Adding Task"}
        </Text>
        {this.getOptionButtons()}
        <View style={{ ...styles.form, height: height }}>
          {this.renderForm()}
        </View>
        {this.props.isTaskPressed && !LocalStorage.state.isAddSubtaskClick
          ? LocalStorage.state.option == "attachment"
            ? this.uploadAttachmentsButton()
            : null
          : this.addTaskSubTaskButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#fffffc",
  },
  header: {
    alignItems: "center",
    margin: 10,
  },
  addBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 10,
    shadowOffset: { width: 4, height: 4 },
    shadowColor: "#ade8f4",
    shadowOpacity: 1.0,
  },
  pheader: {
    backgroundColor: "#bbc9c9",
    //shadowColor: '#000000',
    //shadowOffset: {width: 0, height: 2},
    //shadowRadius: 16,
    //shadowOpacity: 0.4,
    //elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  panel: {
    padding: 20,
    backgroundColor: "#bbc9c9",
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
    height: "100%",
  },
  panelButton: {
    padding: 20,
    borderRadius: 45,
    backgroundColor: "#303030",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.2,
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  inputText: {
    color: "#FFF",
    borderBottomColor: colors.boarderInput,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    textAlign: "center",
    marginVertical: "5%",
  },
  subTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  form: {
    height: Platform.OS == "ios" ? "80%" : null,
  },
  attachment: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
