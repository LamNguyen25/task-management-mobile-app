import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import Swipeable from "react-native-swipeable";
import TaskSubButton from "./TaskSubButton";
import ItemController from "../controllers/ItemController";
import { colors } from "../styles/styles";
import { getUserID } from "../controllers/AuthController";
import LocalStorage from "../entities/LocalStorage";

export default class ViewTask extends React.Component {
  doneUndone = (task, isDone) => {
    let answer = isDone ? "COMPLETED" : "INCOMPLETED";
    new ItemController()
      .getTaskCollectionRef()
      .doc(task.id)
      .update({ isArchived: isDone })
      .then(() => {
        console.log(task.name + " was marked as " + answer);
      })
      .catch((error) => {
        let errorMsg = error + "\n'" + task.name + "' was NOT marked as ";
        Alert.alert("Error", errorMsg + answer);
      });
  };

  doneUndoneHandler = (task, action) => {
    let title =
      "You are about to mark '" + task.name + "' and its subtasks as ";
    title += action == "incomplete" ? "NOT completed" : "completed";
    Alert.alert(title, "Do you wish to Continue?", [
      {
        text: "Yes, Continue",
        onPress: () => {
          this.doneUndone(task, action == "incomplete" ? false : true);
          this.setChildren(
            task,
            action == "incomplete"
              ? LocalStorage.state.completedTasks
              : LocalStorage.state.uncompletedTasks,
            action
          );
          this.props.onRefresh();
        },
      },
      { text: "Cancel" },
    ]);
  };

  setChildren = (parent, tasks, action) => {
    tasks.forEach((t) => {
      if (parent.id == t.parentID) {
        if (action == "complete") {
          this.doneUndone(t, true);
        } else if (action == "incomplete") {
          this.doneUndone(t, false);
        } else if (action == "delete") {
          this.deleteTask(t);
        }

        this.setChildren(t, tasks, action);
      }
    });
  };

  deleteTask = (task) => {
    let cntrl = new ItemController();

    cntrl.deleteAttachments(task.created_at);

    cntrl
      .deleteTask(task.id)
      .then(async () => {
        console.log("task: " + task.name + " was successfully deleted");
      })
      .catch((error) => {
        Alert.alert(
          "Deletion Error",
          error + "\n'" + task.name + "' was NOT deleted"
        );
      });
  };

  _deleteTaskHandler = async (task) => {
    Alert.alert(
      "You are about to DELETE '" + task.name + "' and its subtasks",
      "Do you wish to Continue?",
      [
        {
          text: "YES, DELETE ALL",
          style: "destructive",
          onPress: async () => {
            this.deleteTask(task);
            this.setChildren(task, LocalStorage.state.allTasks, "delete");
            this.props.onRefresh();
          },
        },
        { text: "CANCEL" },
      ]
    );
  };

  getRightButtons = () => {
    let task = this.props.task;
    let buttons = [];
    task.isArchived
      ? buttons.push(
          <TaskSubButton
            type="not done"
            color={colors.green}
            onPress={() => {
              this.doneUndoneHandler(task, "incomplete");
            }}
          />
        )
      : buttons.push(
          <TaskSubButton
            type="done"
            color={colors.green}
            onPress={() => {
              this.doneUndoneHandler(task, "complete");
            }}
          />
        );
    buttons.push(
      <TaskSubButton
        type="delete"
        color={colors.warning}
        onPress={() => {
          this._deleteTaskHandler(task);
        }}
      />
    );
    return buttons;
  };

  render() {
    let task = this.props.task;
    let notSet = -1;
    let na = "N/A";
    return (
      <Swipeable rightButtons={this.getRightButtons()} key={task.id}>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => {
            this.props.onPress();
          }}
        >
          {/*****************Task Header: TaskName and TaskDescription  ******************/}
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#404F4F",
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 10,
              }}
            >
              {task.name}
            </Text>
          </View>
          {/*****************Task Body: Task Attributes ******************/}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <View style={{ flexDirection: "row", marginHorizontal: 5 }}>
              <Text style={{ color: "gray" }}>Due Date:</Text>
              <Text style={{ color: "gray", fontWeight: "bold" }}>
                {task.dueDate ? task.dueDate : na}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    margin: 10,
  },
  headerTitle: {
    color: colors.mediumTurquoise,
    fontSize: 24,
    fontWeight: "bold",
  },
  listItem: {
    padding: 5,
    backgroundColor: colors.taskBackground,
    borderColor: colors.taskBackground,
    borderWidth: 1,
    margin: 10,
    borderRadius: 10,
    shadowOffset: { width: 4, height: 4 },
    shadowColor: colors.taskShadow,
    shadowOpacity: 1.0,
    elevation: 10,
  },
});
