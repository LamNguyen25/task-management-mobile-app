import React from "react";
import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "../styles/styles";
import UserController from "../controllers/UserController";
import ItemController from "../controllers/ItemController";
import { deleteUser } from "../controllers/AuthController";
import AccOptionRow from "../components/AccOptionRow";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default class AccountUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      profilePic: "",
    };
  }
  componentDidMount() {
    this.getUserProfile();
    // setInterval(this.getUserProfile, 4000);
    if (this.state.email) {
      setInterval(this.getUserProfile, 3000);
    }
  }

  getUserProfile = () => {
    new ItemController()
      .getTaskCollectionRef()
      .doc("profile")
      .get()
      .then(async (doc) => {
        let userProfile = doc.data();
        this.setState({
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          email: userProfile.email,
          profilePic: userProfile.profile_picture,
        });
        // if(LocalStorage.getProfilePictureURI()) {
        //   this.setState({profilePic: LocalStorage.getProfilePictureURI()});
        // }
        if (!this.state.profilePic) {
          this.setState({ profilePic: "https://picsum.photos/200/300" });
        }
        // console.log(this.state);
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  changeEmailHandler = () => {
    Alert.alert(
      "You are about to change your Account Email",
      "Do you wish to Continue?",
      [
        {
          text: "CONTINUE",
          style: "destructive",
          onPress: () => this.props.navigation.navigate("ChangeEmail"),
        },
        { text: "CANCEL" },
      ]
    );
  };

  resetPasswordHandler = () => {
    this.props.navigation.navigate("ResetPassword");
  };

  deleteAccountHandler = () => {
    Alert.alert(
      "You are about to DELETE your account",
      "Do you wish to Continue?",
      [
        {
          text: "CONTINUE",
          style: "destructive",
          onPress: () => {
            let ctrl = new ItemController();
            ctrl
              .getTaskCollectionRef()
              .get()
              .then((coll) => {
                coll.docs.forEach((doc) => {
                  ctrl.deleteTask(doc.id);
                });
              });
            new UserController().signOut();
            deleteUser();
          },
        },
        { text: "CANCEL" },
      ]
    );
  };

  logoutUserHandler = () => {
    Alert.alert("You are about Sign Out", "Do you wish to Continue?", [
      {
        text: "CONTINUE",
        style: "destructive",
        onPress: () => {
          new UserController().signOut();
        },
      },
      { text: "CANCEL" },
    ]);
  };
  getImage = async () => {
    await ImagePicker.requestCameraRollPermissionsAsync();
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
    })
      .then((result) => {
        console.log(result);
        this.setAttachment(result);
      })
      .catch((error) => {
        throw error;
      });
  };

  setAttachment = async (image) => {
    if (image.uri) {
      let date = Date.now().toString();
      console.log("Set att");
      let blob = await this.createBlob(image.uri);

      //uploads blob(attachment) to database
      let url = await this.uploadBlob(blob, date);
      console.log(url);
      if (url) {
        let user = new ItemController();
        user
          .getTaskCollectionRef()
          .doc("profile")
          .update({ profile_picture: url })
          .then(() => {
            Alert.alert("Successful!", "New Picture" + " was uploaded", [
              {
                text: "CONTINUE",
                onPress: () => {
                  this.setState({ profilePic: url });
                },
              },
            ]);
          })
          .catch((error) => {
            Alert.alert("Error", "New Picture" + " cannot be uploaded");
          });
      }
    }
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

  render() {
    return (
      <View style={[styles.container, { justifyContent: "flex-start" }]}>
        <View style={extraStyles.profilePicContainer}>
          <Image
            style={extraStyles.profilePic}
            source={{ uri: this.state.profilePic }}
          />
          <TouchableOpacity
            style={extraStyles.editPicture}
            onPress={() => this.getImage()}
          >
            <MaterialCommunityIcons name="camera" color={"black"} size={22} />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <View
            style={{
              alignItems: "center",
              fontWeight: "bold",
              marginBottom: "2%",
            }}
          >
            <Text>{this.state.firstName + " " + this.state.lastName}</Text>
          </View>
          <Text>{"Email: " + " " + this.state.email}</Text>
        </View>
        <View style={styles.accountOptionsContainer}>
          <View style={styles.accountOptionsHeader}>
            <Text style={styles.optionsHeaderText}>Account Settings</Text>
          </View>
          <ScrollView>
            <AccOptionRow
              title="Change Account Email"
              onPress={this.changeEmailHandler}
              icon="email-edit-outline"
            />
            <AccOptionRow
              title="Change Password"
              onPress={this.resetPasswordHandler}
              icon="key-variant"
            />
            <AccOptionRow
              title="Delete Account"
              onPress={this.deleteAccountHandler}
              icon="delete-forever"
            />
            <AccOptionRow
              title="Log Out"
              onPress={this.logoutUserHandler}
              icon="exit-to-app"
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const extraStyles = StyleSheet.create({
  profilePicContainer: {
    height: "20%",
    marginTop: "5%",
    borderRadius: 100,
    flexDirection: "row",
  },
  profilePic: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  editPicture: {
    backgroundColor: "#E4E3DD",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    height: "25%",
    width: "10%",
    marginLeft: "-14%",
  },
  userInfo: {
    height: "5%",
    marginTop: "20%",
    flexDirection: "column",
    marginBottom: "15%",
  },
});
