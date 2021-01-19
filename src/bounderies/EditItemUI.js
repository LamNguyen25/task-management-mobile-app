import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TextComponent,
} from "react-native";
import { styles, colors } from "../styles/styles";
import ItemController from "../controllers/ItemController";
import {
  TaskNameValidator,
  TaskDateValidator,
  TaskDescriptionValidator,
  TaskPointsValidator,
  TaskWeightValidator,
} from "../controllers/utils";
/************************************************************************************************
 * UI for when user want to edit a task
 ************************************************************************************************/

export default function EditItemUI({ route, navigation }) {
  //States for inputText
  const [newName, setNewName] = useState({ value: "", error: "" });
  const [newDueDate, setNewDueDate] = useState({ value: "", error: "" });
  const [newReminderDate, setNewReminderDate] = useState({
    value: "",
    error: "",
  });
  const [newDescription, setNewDescription] = useState({
    value: "",
    error: "",
  });
  const [newPossiblePts, setNewPossiblePts] = useState({
    value: "",
    error: "",
  });
  const [newRcvPts, setNewRcvPts] = useState({ value: "", error: "" });
  const [newWeight, setNewWeight] = useState({ value: "", error: "" });
  const [newParentID, setNewParentID] = useState("");
  const [newAttachmentURL, setNewAttachmentURL] = useState("");
  const [newIsArchived, setNewIsArchived] = useState(false);

  //States for task
  const [task, setTask] = useState([]);
  const taskData = route.params.task;
  // const taskData = taskDetail;
  //Gets data for the current task
  const getCurrentTask = () => {
    setTask(taskData);
    //Save data to display to user
    setNewName({ value: taskData.name, error: "" });
    setNewDueDate({ value: taskData.dueDate, error: "" });
    setNewReminderDate({ value: taskData.reminderDate, error: "" });
    setNewDescription({ value: taskData.description, error: "" });
    setNewPossiblePts({
      value: taskData.possiblePts == -1 ? "" : taskData.possiblePts,
      error: "",
    });
    setNewRcvPts({
      value: taskData.rcvPts == -1 ? "" : taskData.rcvPts,
      error: "",
    });
    setNewWeight({
      value: taskData.weight == -1 ? "" : taskData.weight,
      error: "",
    });
    setNewIsArchived(taskData.isArchived);
    setNewParentID(taskData.parentID);
    setNewAttachmentURL(taskData.attachmentURL);

    if (taskData.name == null) {
      setNewName({ value: "", error: "" });
    }
    if (taskData.dueDate == null) {
      setNewDueDate({ value: "", error: "" });
    }
    if (taskData.reminderDate == null) {
      setNewReminderDate({ value: "", error: "" });
    }
    if (taskData.description == null) {
      setNewDescription({ value: "", error: "" });
    }
    if (taskData.rcvPts == null) {
      setNewRcvPts({ value: "", error: "" });
    }
    if (taskData.possiblePts == null) {
      setNewPossiblePts({ value: "", error: "" });
    }
    if (taskData.weight == null) {
      setNewWeight({ value: "", error: "" });
    }
    if (taskData.isArchived == null) {
      setNewIsArchived(false);
    }
    if (taskData.parentID == null) {
      setNewParentID("");
    }
    if (taskData.attachmentURL == null) {
      setNewAttachmentURL("");
    }
  };

  //Gets user input from inputText and updates firestore
  const updateTask = () => {
    let itemController = new ItemController();
    const nameError = TaskNameValidator(newName.value);
    const dueDateError = TaskDateValidator(newDueDate.value);
    const reminderDateError = TaskDateValidator(newReminderDate.value);
    const descriptionError = TaskDescriptionValidator(newDescription.value);
    const possiblePtsError = TaskPointsValidator(newPossiblePts.value);
    const rcvPtsError = TaskPointsValidator(newRcvPts.value);
    const weightError = TaskWeightValidator(newWeight.value);

    if (
      nameError ||
      dueDateError ||
      reminderDateError ||
      descriptionError ||
      possiblePtsError ||
      rcvPtsError ||
      weightError
    ) {
      setNewName({ ...newName, error: nameError });
      setNewDueDate({ ...newDueDate, error: dueDateError });
      setNewReminderDate({ ...newReminderDate, error: reminderDateError });
      setNewDescription({ ...newDescription, error: descriptionError });
      setNewPossiblePts({ ...newPossiblePts, error: possiblePtsError });
      setNewRcvPts({ ...newRcvPts, error: rcvPtsError });
      setNewWeight({ ...newWeight, error: weightError });
      return false;
    }
    task.name = newName.value;
    task.dueDate = newDueDate.value;
    task.reminderDate = newReminderDate.value;
    task.description = newDescription.value;
    task.possiblePts = newPossiblePts.value ? Number(newPossiblePts.value) : -1;
    task.rcvPts = newRcvPts.value ? Number(newRcvPts.value) : -1;
    task.weight = newWeight.value ? Number(newWeight.value) : -1;
    task.parentID = newParentID;
    task.attachmentURL = newAttachmentURL;
    task.isArchived = newIsArchived;

    itemController.updateTask(taskData.id, task);
    return true;
  };

  // Only need to get task once
  useEffect(() => {
    getCurrentTask();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#bbc9c9" }}>
      <View style={styles.resetContainer}>
        <View style={styles.resetTopContainer} />
        <View style={styles.resetCenterContainer}>
          <View>
            {/* <Text style={styles.resetTitle}>Edit Task</Text> */}
            <Text style={styles.resetInputLabel}>
              Make any changes need to the task and click update to save these
              changes {"\n"}
            </Text>
            <Text style={styles.resetInputLabel}>
              Name (Required, cannot be empty)
            </Text>

            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 10,
                color: "#000000",
              }}
              label="Email"
              value={newName.value}
              onChangeText={(text) => setNewName({ value: text, error: "" })}
              error={!!newName.error}
            />
            {newName.error ? (
              <Text style={styles.resetError}>{newName.error}</Text>
            ) : null}

            <Text style={styles.resetInputLabel}>
              Due Date (Optional, MM-DD-YYYY)
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 10,
                color: "#000000",
              }}
              label="Email"
              value={newDueDate.value}
              onChangeText={(text) => setNewDueDate({ value: text, error: "" })}
              error={!!newDueDate.error}
            />
            {newDueDate.error ? (
              <Text style={styles.resetError}>{newDueDate.error}</Text>
            ) : null}

            <Text style={styles.resetInputLabel}>
              Reminder Date (Optional, MM-DD-YYYY)
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 10,
                color: "#000000",
              }}
              label="Email"
              value={newReminderDate.value}
              onChangeText={(text) =>
                setNewReminderDate({ value: text, error: "" })
              }
              error={!!newReminderDate.error}
            />
            {newReminderDate.error ? (
              <Text style={styles.resetError}>{newReminderDate.error}</Text>
            ) : null}

            <Text style={styles.resetInputLabel}>Description (Optional)</Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 10,
                color: "#000000",
              }}
              label="Email"
              value={newDescription.value}
              onChangeText={(text) =>
                setNewDescription({ value: text, error: "" })
              }
              error={!!newDescription.error}
            />
            {newDescription.error ? (
              <Text style={styles.resetError}>{newDescription.error}</Text>
            ) : null}

            <Text style={styles.resetInputLabel}>
              Points Received (Optional, must be a number bigger than 0)
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 10,
                color: "#000000",
              }}
              label="Email"
              value={"" + newRcvPts.value}
              onChangeText={(text) => setNewRcvPts({ value: text, error: "" })}
              error={!!newRcvPts.error}
            />
            {newRcvPts.error ? (
              <Text style={styles.resetError}>{newRcvPts.error}</Text>
            ) : null}

            <Text style={styles.resetInputLabel}>
              Possible Points (Optional, must be a number bigger than 0)
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 10,
                color: "#000000",
              }}
              label="Email"
              value={"" + newPossiblePts.value}
              onChangeText={(text) =>
                setNewPossiblePts({ value: text, error: "" })
              }
              error={!!newPossiblePts.error}
            />
            {newPossiblePts.error ? (
              <Text style={styles.resetError}>{newPossiblePts.error}</Text>
            ) : null}

            <Text style={styles.resetInputLabel}>
              Weight (Optional, must be a number between 0 and 100)
            </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 10,
                color: "#000000",
              }}
              label="Email"
              value={"" + newWeight.value}
              onChangeText={(text) => setNewWeight({ value: text, error: "" })}
              error={!!newWeight.error}
            />
            {newWeight.error ? (
              <Text style={styles.resetError}>{newWeight.error}</Text>
            ) : null}

            <View>
              <TouchableOpacity
                // style={[styles.button, { backgroundColor: colors.warning }]}
                style={[styles.button, { backgroundColor: colors.taskShadow }]}
                onPress={() => {
                  if (updateTask()) {
                    new ItemController().downloadAllTasks();
                    Alert.alert(
                      "Update Successful!",
                      "Your task has been updated successfully!",
                      [
                        {
                          text: "OK",
                          onPress: () => {},
                        },
                      ],
                      { cancelable: false }
                    );
                    navigation.navigate("View Tasks");
                  }
                }}
              >
                <Text
                  style={{ fontSize: 25, color: "#474140", fontWeight: "bold" }}
                >
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.resetBottomContainer} />
      </View>
    </ScrollView>
  );
}
