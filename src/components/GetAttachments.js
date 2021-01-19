import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../styles/styles";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import LocalStorage from "../entities/LocalStorage";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default class GetAttachments extends React.Component {
  state = { attachments: [] };

  setAttachment = (att) => {
    let index = LocalStorage.state.attachments.length.toString();
    let newAtt = { ...att, index };
    if ((att.type == "image" && !att.cancelled) || att.type == "success") {
      let attachments = [...this.state.attachments, att];

      LocalStorage.addAttachment(newAtt);
      this.setState({ attachments });
    }
  };

  getImage = async () => {
    await ImagePicker.requestCameraRollPermissionsAsync();
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
    })
      .then((result) => {
        this.setAttachment(result);
      })
      .catch((error) => {
        throw error;
      });
  };
  takeImage = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    ImagePicker.launchCameraAsync()
      .then((result) => {
        this.setAttachment(result);
      })
      .catch((error) => {
        throw error;
      });
  };
  getFile = () => {
    DocumentPicker.getDocumentAsync()
      .then((result) => {
        this.setAttachment(result);
      })
      .catch((error) => {
        throw error;
      });
  };
  removeAttachment = (removeAtt) => {
    Alert.alert("Remove", "Do you want to remove item?", [
      {
        text: "YES, Remove",
        style: "destructive",
        onPress: () => {
          let attachments = this.state.attachments;
          let localAtts = LocalStorage.getAttachments();

          attachments.splice(this.state.attachments.indexOf(removeAtt), 1);
          localAtts.splice(localAtts.indexOf(removeAtt), 1);

          LocalStorage.setAttachments(localAtts);
          this.setState({ attachments });
        },
      },
      { text: "CANCEL" },
    ]);
  };

  renderImage = (image) => {
    let att;
    let isPhoto = false;

    if (image.name) {
      let split = image.name.split(".");
      let extension = split[split.length - 1];

      if (extension == "jpg" || extension == "png") isPhoto = true;
    }

    if (image.name && !isPhoto) {
      att = (
        <View
          style={{
            height: 200,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>NO IMAGE AVAILABLE</Text>
          <MaterialCommunityIcons name="cancel" color={"white"} size={150} />

          <Text>{image.name}</Text>
        </View>
      );
    } else {
      att = (
        <Image
          source={image}
          style={{ width: 200, height: 200 }}
          resizeMode="cover"
        />
      );
    }
    let margin =
      Platform.OS == "ios"
        ? { marginVertical: 10 }
        : this.props.isTaskPressed
        ? { marginVertical: 10 }
        : { marginHorizontal: 10 };
    return (
      <TouchableOpacity
        style={{ ...margin }}
        onPress={() => this.removeAttachment(image)}
        key={image.index}
      >
        {att}
      </TouchableOpacity>
    );
  };
  render() {
    let color = colors.vividSkyBlue; // color="#ade8f4"
    let iconSize = SCREEN_WIDTH * 0.15;

    console.log(
      LocalStorage.getAttachments().length + " " + this.state.attachments.length
    );

    if (LocalStorage.getAttachments().length != this.state.attachments.length)
      this.setState({ attachments: LocalStorage.getAttachments() });

    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.header}>
          Add Attachments
          {LocalStorage.state.bsOption == "attachment" &&
          !LocalStorage.state.isAddSubtaskClick
            ? " to task\n"
            : null}
        </Text>
        <Text
          style={{
            ...styles.header,
            marginTop: -25,
            fontSize: 20,
            marginBottom: LocalStorage.state.isAddSubtaskClick ? 0 : -10,
          }}
        >
          {LocalStorage.state.bsOption == "attachment" &&
          !LocalStorage.state.isAddSubtaskClick
            ? this.props.task.name
            : null}
        </Text>
        <View style={{ flexDirection: "row" }}>
          {/*************** Gallery Button *******************/}
          <TouchableOpacity
            style={styles.attachment}
            onPress={() => this.getImage()}
          >
            <MaterialCommunityIcons
              name="image"
              color={color}
              size={iconSize}
            />
            <Text style={styles.attName}>Gallery</Text>
          </TouchableOpacity>
          {/*************** Take Photo Button *******************/}
          <TouchableOpacity
            style={styles.attachment}
            onPress={() => this.takeImage()}
          >
            <MaterialCommunityIcons
              name="camera"
              color={color}
              size={iconSize}
            />
            <Text style={styles.attName}>Take Photo</Text>
          </TouchableOpacity>
          {/*************** File Button *******************/}
          <TouchableOpacity
            style={styles.attachment}
            onPress={() => this.getFile()}
          >
            <MaterialCommunityIcons name="file" color={color} size={iconSize} />
            <Text style={styles.attName}>File</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={LocalStorage.state.attachments}
          keyExtractor={(item) => item.index}
          renderItem={({ item }) => this.renderImage(item)}
          horizontal={
            Platform.OS == "ios"
              ? false
              : this.props.isTaskPressed
              ? false
              : true
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  attachment: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  attName: {
    color: "white",
    fontWeight: "bold",
    marginTop: -10,
  },
});
