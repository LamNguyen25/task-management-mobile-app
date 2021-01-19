import React from "react";

import DatabaseUI from "../bounderies/DatabaseUI";
import LocalStorage from "../entities/LocalStorage";

import { getUserID } from "../controllers/AuthController";

export default class ItemController extends React.Component {
  state = {
    taskCollectionRef: DatabaseUI.getCollectionRef(getUserID()),
    storage: DatabaseUI.getStorage(),
  };

  getTaskCollectionRef = () => this.state.taskCollectionRef;

  getStorage = () => this.state.storage;

  getStorageRef = (taskCreatedAt) =>
    this.getStorage().ref(getUserID() + "/" + taskCreatedAt);

  getCurrentTask = async (taskID) => {
    var task = [];
    await this.getTaskCollectionRef()
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id == taskID) {
            task = doc.data();
          }
        });
      })
      .catch((err) => {
        console.log("Error getting doc: ", err);
      });
    return task;
  };

  downloadAllTasks = async () => {
    let ucTasks = await this.downloadTasks("isArchived", "==", false);
    let cTasks = await this.downloadTasks("isArchived", "==", true);

    let allTasks = [...(await cTasks), ...(await ucTasks)].sort((t1, t2) =>
      this.compareTasks(t1, t2)
    );

    let local = LocalStorage;
    local.state.uncompletedTasks = await ucTasks;
    local.state.completedTasks = await cTasks;
    local.state.allTasks = allTasks;

    console.log("downloading Tasks");
    return { ucTasks, cTasks, allTasks };
  };

  downloadTasks = async (attribute, logic, value) => {
    return await this.getTaskCollectionRef()
      .where(attribute, logic, value)
      .get()
      .then(async (collection) => {
        let tasks = await collection.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        // Sort tasks by dueDate then name
        tasks = tasks.sort((t1, t2) => this.compareTasks(t1, t2));

        return tasks;
      })
      .catch((error) => console.log(error));
  };

  addTask = (Item) => {
    return DatabaseUI.addTask(Item);
  };

  updateTask = (taskID, task) => {
    var taskRef;
    taskRef = this.getTaskCollectionRef().doc(taskID);
    return taskRef
      .update(
        task
      )
      .then(() => {
        console.log("Update success");
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };

  deleteTask = async (taskID) => {
    await this.getTaskCollectionRef().doc(taskID).delete();
  };

  deleteAttachments = async (taskCreatedAt) => {
    let storageDir = await this.getStorageRef(taskCreatedAt);

    let dir = await storageDir.listAll();

    dir.items.forEach((file) => {
      storageDir
        .child(file.name)
        .delete()
        .then(() =>
          console.log(
            "file :" +
            storageDir.fullPath +
            "/" +
            file.name +
            "\n successfully deleted"
          )
        )
        .catch((error) => console.log(error));
    });
  };

  compareTasks = (t1, t2) => {
    var date1 = 0;
    var date2 = 0;
    if (t1.dueDate) {
      var parts = t1.dueDate.split("-");
      date1 = Number(parts[2] + parts[0] + parts[1]);
    }
    if (t2.dueDate) {
      parts = t2.dueDate.split("-");
      date2 = Number(parts[2] + parts[0] + parts[1]);
    }

    let score = date1 - date2;

    if (!score && t1.name < t2.name) score = -1;

    return score;
  };
}
