import React from "react";
// import ItemController from "../controllers/ItemController";

class LocalStorage {
  static instance = this.instance || new LocalStorage();

  state = {
    completedTasks: [],
    uncompletedTasks: [],
    allTasks: [],
    profilePictureURI: null,
    isReset: false,
    attachments: [], //used only for uploading attachments
    option: "",
    errorMessage: null,
    name: "",
    desc: "",
    weight: "",
    pssPts: "",
    parentId: "", // get parent ID if add a task from its parent
    isAddSubtaskClick: false,
    dueDate: null,
    reminderTime: null,
    reminderDate: null
  };

  getAllTasks = () => {
    return this.state.allTasks;
  };

  getCompletedTasks = () => {
    return this.state.completedTasks;
  };

  getUncompletedTasks = () => {
    return this.state.uncompletedTasks;
  };

  setAttachments = (attachments) => (this.state.attachments = attachments);
  addAttachment = (att) => {
    this.state.attachments.push(att);
  };
  getAttachments = () => {
    return this.state.attachments;
  };
  popAttachment = () => {
    return this.state.attachments.pop();
  };

  setProfilePictureURI = (imageURI) => (this.state.profilePictureURI = imageURI);
  getProfilePictureURI = () => {return this.state.profilePictureURI};

  setOption = (option) => (this.state.option = option);
  setName = (name) => (this.state.name = name);
  getName = () => { return this.state.name; }

  setDesc = (desc) => (this.state.desc = desc);
  setWeight = (weight) => (this.state.weight = weight);
  setPssPts = (pssPts) => (this.state.pssPts = pssPts);
  setIsAddSubtaskClick = (clicked) => (this.state.isAddSubtaskClick = clicked);
  setDueDate = (dueDate) => (this.state.dueDate = dueDate);
  setReminderDate = (date) => {
    const moment = require('moment');
    this.state.reminderDate = moment(new Date(date)).format('MM-DD-YYYY');
    // this.state.reminderDate = date
  };
  getReminderDate = () => { return this.state.reminderDate; };
  setReminderTime = (time) => {
    const moment = require('moment');

    this.state.reminderTime = moment(new Date(time)).format('HH:mm:ss.s');
  };
  getReminderTime = () => { return this.state.reminderTime; };
  setResetStatus = (isReset) => (this.state.isReset = isReset);
  getResetStatus = () => { return this.state.isReset; }
  reset = () => {
    this.state.isReset = true;
    this.state.option = "",
    this.state.errorMessage = null,
    this.state.name = "",
    this.state.desc = "",
    this.state.weight = "",
    this.state.pssPts = "",
    this.state.parentId = "", // get parent ID if add a task from its parent
    this.state.isAddSubtaskClick = false,
    this.state.dueDate = null
    this.state.reminderTime = null,
    this.state.reminderDate = null
  };

}
export default LocalStorage = LocalStorage.instance;
