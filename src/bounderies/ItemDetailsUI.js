import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
  Linking,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EditItemUI from "./EditItemUI";
import ItemController from "../controllers/ItemController";
import * as WebBrowser from "expo-web-browser";
import WeightedItemDetailsUI from "./WeightedItemDetailsUI";

export default function ItemDetailsUI({ task, navigation }) {
  const getAttURLs = (attachmentURL) => {
    let atts = attachmentURL;
    let urls = atts.map((url) => {
      return url.split("**/**");
    });

    return urls;
  };

  const [attachments, setAttachments] = useState(
    getAttURLs(task.attachmentURL)
  );

  const renderEditTask = (taskDetail) => {
    return <EditItemUI taskDetail={task} />;
  };

  const renderAttachment = (att) => {
    let name = att[0];
    let url = att[2];
    return (
      <TouchableOpacity
        key={att[1]}
        style={{ ...styles.itemBox, marginHorizontal: 5 }}
        onPress={() => {
          Platform.OS == "ios"
            ? WebBrowser.openBrowserAsync(url)
            : Linking.openURL(url);
        }}
        onLongPress={() => {
          Alert.alert(
            "You are about to DELETE attachment '" + name,
            "Do you wish to Continue?",
            [
              {
                text: "YES, DELETE",
                style: "destructive",
                onPress: () => {
                  let ctrl = new ItemController();

                  task.attachmentURL.splice(
                    task.attachmentURL.indexOf(
                      name + "**/**" + att[1] + "**/**" + url
                    ),
                    1
                  );

                  ctrl.updateTask(task.id, task);
                  setAttachments(getAttURLs(task.attachmentURL));

                  ctrl
                    .getStorageRef(task.created_at)
                    .child(name)
                    .delete()
                    .then(() => {
                      console.log(
                        "attachment :" + file.name + "\n successfully deleted"
                      );
                    })
                    .catch((error) => console.log(error));
                },
              },
              { text: "CANCEL" },
            ]
          );
        }}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={{ fontSize: 18, color: "#9F402D", fontWeight: "bold" }}>
          {task.name}
        </Text>
      </View>

      <View style={styles.centerContainer}>
        <View style={styles.cardViewStyle} blurRadius={90}>
          <TouchableOpacity style={styles.editText}>
            <Icon name="grease-pencil" size={20} />
            <Text
              onPress={() => {
                navigation.navigate("EditItemUI", { task: task });
              }}
              size={20}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <View style={styles.taskContent}>
            <SafeAreaView style={{ flex: 1 }}>
              <ScrollView>
                <Text style={styles.itemBox}>Due date: {task.dueDate}</Text>
                <Text style={styles.itemBox}>
                  Reminder date: {task.reminderDate}
                </Text>
                <Text style={styles.itemBox}>
                  Description: {task.description}
                </Text>
                <WeightedItemDetailsUI route={task} navigation={navigation} />
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontSize: 20 }}>Attachments:</Text>
                  <FlatList
                    data={attachments}
                    keyExtractor={(item) => item[2]}
                    renderItem={({ item }) => renderAttachment(item)}
                    horizontal={true}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    marginLeft: -20,
  },
  topContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 10,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  cardViewStyle: {
    flex: 1,
    width: "90%",
    backgroundColor: "#B0BFBF",
    borderColor: "#727A83",
    borderWidth: 1,
    borderRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#727A83",
    shadowOpacity: 1.0,
  },
  editText: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    paddingRight: 10,
    justifyContent: "flex-end",
  },
  taskContent: {
    paddingHorizontal: 15,
    flex: 11,
    justifyContent: "space-around",
    opacity: 1,
    paddingVertical: 10,
  },
  itemBox: {
    marginBottom: 20,
    // shadowOffset: { width: 5, height: 5 },
    // shadowColor: "#727A83",
    backgroundColor: "#A4B6B6",
    // opacity: 0.8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  itemBox: {
    marginBottom: 20,
    // shadowOffset: { width: 5, height: 5 },
    // shadowColor: "#727A83",
    backgroundColor: "#A4B6B6",
    // opacity: 0.8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  bottomContainer: {
    flex: 1,
    width: "100%",
  },
});
