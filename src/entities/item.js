import React from "react";

class Item extends React.Component {
  static instance = this.instance || new Item();

  constructor(props) {
    super(props);
    this.name = "";
    this.parentID = "";
    this.dueDate = "";
    this.reminderDate = "";
    this.reminderTime = "";
    this.description = "";
    this.isArchived = false;
    this.possiblePts = -1;
    this.rcvPts = -1;
    this.weight = -1;
    this.attachmentURL = [];
    this.created_at = "";
  }

  setName = ((name) => {
    this.name = name;
  }).bind(this);
  setDueDate = ((dueDate) => {
    this.dueDate = dueDate;
  }).bind(this);
  setReminderDate = ((reminderDate) => {
    this.reminderDate = reminderDate;
  }).bind(this);
  setReminderTime = ((reminderTime) => {
    this.reminderTime = reminderTime;
  }).bind(this);
  setparentID = ((parentID) => {
    this.parentID = parentID;
  }).bind(this);
  setDescription = ((description) => {
    this.description = description;
  }).bind(this);
  setIsArchived = ((isArchived) => {
    this.isArchived = isArchived;
  }).bind(this);
  setPossiblePts = ((possiblePts) => {
    this.possiblePts = possiblePts;
  }).bind(this);
  setRcvPts = ((rcvPts) => {
    this.rcvPts = rcvPts;
  }).bind(this);
  setWeight = ((weight) => {
    this.weight = weight;
  }).bind(this);
  setAttachmentURL = ((attachmentURL) => {
    this.attachmentURL = attachmentURL;
  }).bind(this);
  setCreatedAt = ((date) => {
    this.created_at = date;
  }).bind(this);

  getName = (() => {
    return this.name;
  }).bind(this);

  getDueDate = (() => {
    return this.dueDate;
  }).bind(this);
  getDescription = (() => {
    return this.description;
  }).bind(this);
  getArchived = (() => {
    return this.isArchived;
  }).bind(this);

  getCreatedAt = (() => {
    return this.created_at;
  }).bind(this);

  mConverter = {
    toFirestore: function (item) {
      return {
        name: item.name,
        parentID: item.parentID,
        dueDate: item.dueDate,
        reminderDate: item.reminderDate,
        reminderTime: item.reminderTime,
        description: item.description,
        isArchived: item.isArchived,
        possiblePts: item.possiblePts,
        rcvPts: item.rcvPts,
        weight: item.weight,
        attachmentURL: item.attachmentURL,
        created_at: item.created_at,
      };
    },
    fromFirestore: function (snapshot, options) {
      const data = snapshot.data(options);
      return new Item(
        data.name,
        data.parentID,
        data.dueDate,
        data.reminderDate,
        data.description,
        data.isArchived,
        data.possiblePts,
        data.rcvPts,
        data.weight,
        data.attachmentURL,
        data.created_at,
        data.reminderDate,
        data.reminderTime,
      );
    },
  };

  reset = (() => {
    this.name = "";
    this.parentID = "";
    this.dueDate = "";
    this.reminderDate = "";
    this.description = "";
    this.isArchived = false;
    this.possiblePts = -1;
    this.rcvPts = -1;
    this.weight = -1;
    this.attachmentURL = [];
    this.created_at = "";
    this.reminderDate = "";
    this.reminderTime = "";
  }).bind(this);
}

export default Item = Item.instance;
