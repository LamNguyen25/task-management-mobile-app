import React, { memo, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { colors } from "../styles/styles";
import ItemController from "../controllers/ItemController";
import ViewTask from "../components/ViewTask";
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import AddEditTask from "../components/AddEditTask";
import ItemDetailsUI from "./ItemDetailsUI";
import LocalStorage from "../entities/LocalStorage";
import CalendarPicker from "react-native-calendar-picker";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const ViewTasksUI = ({ navigation, route }) => {
  const [tasks, setTasks] = useState([]);
  const [curTask, setCurTask] = useState({});
  const [isTaskPressed, setIsTaskPressed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [height, setHeight] = useState(0);
  const largeBS = SCREEN_HEIGHT * 0.8935;
  const smallBS = SCREEN_HEIGHT * 0.65;
  const isFocused = useIsFocused();
  const bs = React.createRef();
  const [isVissibleBS, setIsVissibleBS] = useState(false);
  const fall = new Animated.Value(1);

  useEffect(() => {
    // getTasks(setTasks);
    onRefresh();
  }, [isFocused]);

  // const getTasks = async (setTasks) => {
  //   let tasks = LocalStorage.getUncompletedTasks();

  //   setTasks(tasks);
  // };

  const onRefresh = async () => {
    setRefreshing(true);
    let nTasks = await new ItemController().downloadAllTasks();
    setTasks(await nTasks.ucTasks);
    // getTasks(setTasks);

    setRefreshing(false);
  };

  const renderTask = (task) => {
    return (
      <ViewTask
        key={task.id}
        task={task}
        navigation={navigation} //might not need this.
        route={route} //use to check the currect view/window
        onRefresh={onRefresh} //updates tasks without getting them from firebase
        onPress={() => {
          setHeight(largeBS);
          setIsTaskPressed(true);
          setCurTask(task);
          toggleBS();
        }}
      />
    );
  };

  const closeBS = () => {
    bs.current.snapTo(1);
    setIsVissibleBS(false);
  };
  const openBS = () => {
    bs.current.snapTo(0);
    setIsVissibleBS(true);
  };
  const toggleBS = () => {
    isVissibleBS ? closeBS() : openBS();
  };

  const renderInner = () => {
    return (
      <AddEditTask
        key={curTask ? curTask.id : new Date.now()}
        navigation={navigation} //might not need this.
        route={route} //use to check the currect view/window
        curTask={curTask} //task that is displayed if a task is pressed
        isTaskPressed={isTaskPressed}
        onRefresh={onRefresh}
        toggleBS={toggleBS}
      ></AddEditTask>
    );
  };

  const renderHeader = () => [
    <TouchableOpacity onPress={toggleBS} key={() => new Date.now()}>
      <View style={styles.pheader}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle}></View>
        </View>
      </View>
    </TouchableOpacity>,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={{
            color: colors.mediumTurquoise,
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          To-Do List
        </Text>
      </View>
      <FlatList
        // data={LocalStorage.state.uncompletedTasks}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderTask(item)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            Platform.OS == "ios" ? setHeight(largeBS) : setHeight(smallBS);
            setIsTaskPressed(false);
            toggleBS();
          }}
        >
          <Ionicons
            name="ios-add-circle"
            color={colors.skyBlueCrayola}
            size={SCREEN_WIDTH * 0.15}
          />
        </TouchableOpacity>
      </View>
      <BottomSheet
        ref={bs}
        snapPoints={[height, 0]}
        renderContent={renderInner}
        renderHeader={renderHeader}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={false} // set to false for on click only.
        enabledContentTapInteraction={false}
        onCloseEnd={() => {
          setIsVissibleBS(false);
          LocalStorage.state.attachments = [];
          LocalStorage.state.bsOption = "";
          LocalStorage.state.isAddSubtaskClick = false;
          LocalStorage.reset();
        }}
      />
    </View>
  );
};

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
  listItem: {
    padding: 20,
    backgroundColor: "#caf0f8",
    borderColor: "#000000",
    margin: 10,
    borderRadius: 10,
    shadowOffset: { width: 4, height: 4 },
    shadowColor: "#ade8f4",
    shadowOpacity: 1.0,
  },
  doneBtn: {
    backgroundColor: "#caffbf",
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: "80%",
    justifyContent: "center",
    alignContent: "center",
  },
  deleteBtn: {
    backgroundColor: "#ef476f",
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: "80%",
    justifyContent: "center",
    alignContent: "center",
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
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 20,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    paddingHorizontal: 20,
    borderRadius: 45,
    backgroundColor: "#303030",
    alignItems: "center",
    marginVertical: 7,
    width: SCREEN_WIDTH * 0.2,
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
});

export default memo(ViewTasksUI);
