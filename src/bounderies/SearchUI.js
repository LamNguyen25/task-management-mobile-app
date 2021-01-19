import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { colors, styles } from "../styles/styles";
import ItemController from "../controllers/ItemController";
import ViewTask from "../components/ViewTask";
import AddEditTask from "../components/AddEditTask";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import LocalStorage from "../entities/LocalStorage";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class SearchUI extends React.Component {
  state = {
    searchCriteria: "",
    errorMessage: null,
    tasks: null,
    foundTasks: null,
    curTask: null,
    isTaskPressed: false,
  };

  largeBS = SCREEN_HEIGHT * 0.8;
  bs = React.createRef();
  fall = new Animated.Value(1);

  componentDidMount() {
    this.getTasks();
    this.setState({ foundTasks: null });
  }

  getTasks = async () => {
    let { allTasks } = await new ItemController().downloadAllTasks();

    this.setState({ tasks: allTasks });
  };

  searchTask = () => {
    this.setState({ foundTasks: null, errorMessage: null });
    let foundTasks = [];
    let criteria = this.state.searchCriteria.toLowerCase();

    if (this.state.searchCriteria.length > 0) {
      this.state.tasks.forEach((task) => {
        if (task.id != "profile") {
          let name = task.name.toLowerCase();
          if (name.includes(criteria)) {
            foundTasks.push(task);
          }
        }
      });
    } else {
      this.setState({ errorMessage: "Please enter a search criteria." });
    }
    if (foundTasks.length > 0) {
      this.setState({ foundTasks });
    } else {
      this.setState({
        errorMessage:
          "No result found using '" + this.state.searchCriteria + "'",
      });
    }
  };

  setTasks = (newTasks) => {
    this.setState({ foundTasks: newTasks });
  };

  renderTask = (task) => {
    return (
      <ViewTask
        key={task.id}
        task={task}
        tasks={this.state.foundTasks}
        navigation={this.props.navigation}
        route={this.props.route}
        onRefresh={this.setTasks}
        onPress={() => {
          this.bs.current.snapTo(0);
          this.setState({ curTask: task, isTaskPressed: true });
        }}
      />
    );
  };

  renderContent = () => {
    return (
      <AddEditTask
        key={Date.now().toString()}
        navigation={this.props.navigation} //might not need this.
        route={this.props.route} //use to check the currect view/window
        curTask={this.state.curTask} //task that is displayed if a task is pressed
        isTaskPressed={this.state.isTaskPressed}
      ></AddEditTask>
    );
  };

  renderHeader = () => [
    <TouchableOpacity onPress={() => this.bs.current.snapTo(1)}>
      <View style={styles.pheader}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle}></View>
        </View>
      </View>
    </TouchableOpacity>,
  ];

  render() {
    return (
      <View style={styles.background}>
        <View style={styles.searchBar}>
          <Text style={styles.searchBarHeader}>Search</Text>

          <TextInput
            style={styles.searchBarInput}
            placeholder="Search criteria"
            value={this.state.searchCriteria}
            onChangeText={(searchCriteria) =>
              this.setState({
                searchCriteria,
              })
            }
          />

          <TouchableOpacity
            style={styles.searchBarButtonContainer}
            onPress={() => {
              this.searchTask(this.state.searchCriteria);
              Keyboard.dismiss();
            }}
          >
            <Icon name={"magnify"} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        <View style={[styles.error, { height: "8%" }]}>
          <Text style={styles.errorMessage}> {this.state.errorMessage} </Text>
        </View>
        <Text style={styles.searchResultsHeader}>Results</Text>

        <View style={styles.taskListContainer}>
          <FlatList
            data={this.state.foundTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => this.renderTask(item)}
          />
        </View>
        <BottomSheet
          ref={this.bs}
          snapPoints={[this.largeBS, 0]}
          renderHeader={this.renderHeader}
          renderContent={this.renderContent}
          initialSnap={1}
          callbackNode={this.fall}
          enabledGestureInteraction={false}
          enabledContentTapInteraction={false}
          onCloseEnd={() => {
            LocalStorage.state.attachments = [];
            LocalStorage.state.bsOption = "";
            LocalStorage.state.isAddSubtaskClick = false;
          }}
        />
      </View>
    );
  }
}
