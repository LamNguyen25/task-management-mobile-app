import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ItemController from "../controllers/ItemController";
import LocalStorage from "../entities/LocalStorage";
import TreeView from "react-native-final-tree-view";
import { ProgressChart } from "react-native-chart-kit";
import { colors } from "../styles/styles";
import ToggleSwitch from "toggle-switch-react-native";

class Node {
  constructor(task) {
    this.task = task;
    this.weight = 0;
    this.possiblePts = 0;
    this.rcvPts = 0;
    this.score = 0;
    this.wScore = 0;
    this.progress = 0;
    this.children = [];
  }
}

export default function WeightedItemDetailsUI({ route, navigation }) {
  let tasks = LocalStorage.state.allTasks;
  let task = route;

  const [isWeighted, setIsWeighted] = useState(true);

  const getChildren = (task, tasks) => {
    let children = [];
    let otherTasks = [];

    for (i = 0; i < tasks.length; ++i) {
      let t = tasks[i];
      if (task.id == t.parentID) {
        let child = new Node(t);
        children.push(child);
      } else {
        if (task.id != t.id) {
          otherTasks.push(t);
        }
      }
    }

    children.forEach((child) => {
      child.children = getChildren(child.task, otherTasks);
    });

    return children;
  };

  const tree = new Node(task);
  const UnweightedTree = new Node(task);
  tree.children = getChildren(task, tasks);
  UnweightedTree.children = getChildren(task, tasks);

  const setUnweightedScores = (root) => {
    if (root.children.length < 1) {
      root.possiblePts = root.task.possiblePts;
      root.rcvPts = root.task.rcvPts;

      if (root.task.rcvPts < 1 || root.task.possiblePts < 1) {
        root.score = 0;
        root.wScore = 0;
      } else {
        root.score = root.task.rcvPts / root.task.possiblePts;
        root.wScore = root.score * (root.weight / 100);
      }
      root.progress = root.task.isArchived ? 1 : 0;
    }

    let w = 1 / root.children.length;
    root.children.forEach((child) => {
      setUnweightedScores(child);
      let p = 0;

      root.possiblePts += child.possiblePts;
      root.rcvPts += child.rcvPts;

      if (child.task.weight == "" || child.task.weight < 0) {
        child.weight = w;
        child.wScore = child.score * w;
      } else {
        child.weight = child.task.weight / 100;
      }
      p = child.progress;
      root.progress += p;
    });

    //Modifying progress
    if (root.children.length != 0) {
      root.progress = root.progress / root.children.length;
    }

    if (root.task.weight == "" || root.task.weight < 0) {
      root.weight = -1;
      root.wScore = root.score;
    } else {
      root.weight = root.task.weight / 100;
      root.wScore = (root.score * root.task.weight) / 100;
    }

    if (root.rcvPts <= 0 || root.possiblePts <= 0) {
      root.rcvPts = 0;
      root.possiblePts = 0;
      root.score = 0;
    } else {
      root.score = root.rcvPts / root.possiblePts;
    }
  };

  const setWeightedScores = (root) => {
    if (root.children.length < 1) {
      if (root.task.rcvPts <= 0 || root.task.possiblePts <= 0) {
        root.score = 0;
        root.wScore = 0;
      } else {
        root.score = root.task.rcvPts / root.task.possiblePts;

        if (root.task.weight == "" || root.task.weight < 0) {
          root.wScore = root.score;
        } else {
          root.wScore = root.score * (root.task.weight / 100);
        }
      }

      root.progress = root.task.isArchived ? 1 : 0;
    }

    let w = 1 / root.children.length;
    root.children.forEach((child) => {
      setWeightedScores(child);
      let p = 0;

      if (child.task.weight == "" || child.task.weight < 0) {
        child.weight = w;
        child.wScore = child.score * w;
        root.score += child.wScore;
        p = child.progress * w;
      } else {
        let weight = child.task.weight / 100;
        child.weight = weight;
        child.wScore = child.score * child.weight;
        root.score += child.wScore;
        p = child.progress * weight;
      }
      root.progress += p;
    });

    if (root.task.weight == "" || root.task.weight < 0) {
      root.weight = -1;
      root.wScore = root.score;
    } else {
      let weight = root.task.weight / 100;
      root.weight = weight;
      root.wScore = root.score * weight;
    }

    if (root.task.possiblePts > 0) {
      root.rcvPts = root.task.possiblePts * root.score;
      root.possiblePts = root.task.possiblePts;
    } else {
      root.rcvPts = root.score * 100;
      root.possiblePts = 100;
    }
  };

  setWeightedScores(tree);
  setUnweightedScores(UnweightedTree);

  const getIndicator = (isExpanded, hasChildrenNodes) => {
    if (!hasChildrenNodes) {
      return "-";
    } else if (isExpanded) {
      return "-";
    } else {
      return ">";
    }
  };

  return (
    <View style={styles.taskWeightContainer}>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <ProgressChart
          data={
            isWeighted
              ? { data: [tree.progress] }
              : { data: [UnweightedTree.progress] }
          }
          width={100}
          height={100}
          strokeWidth={15}
          radius={42}
          hideLegend={true}
          chartConfig={{
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,

            // color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            color: (opacity = 1) => `rgba(0,245,255,${opacity})`,

            strokeWidth: 3, // optional, default 3
            barPercentage: 1,
          }}
        />
        <View
          style={{
            width: 100,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: -100,
          }}
        >
          <Text
            style={{
              // color: "rgba(26,255,146,1)",
              color: "white",
            }}
          >
            {isWeighted
              ? Math.round(tree.progress * 100)
              : Math.round(UnweightedTree.progress * 100)}
            %
          </Text>
          <Text style={{ color: "white" }}>Done</Text>
        </View>
      </View>

      <Text
        style={{
          color: "#9F402D",
          fontWeight: "bold",
          marginTop: 15,
          alignSelf: "center",
        }}
      >
        Task Calculations
      </Text>
      <View style={{ alignItems: "flex-end" }}>
        <ToggleSwitch
          isOn={isWeighted}
          onColor="#00f0ff"
          offColor="#00f0ff"
          label={isWeighted ? "Weighted" : "Unweighted"}
          labelStyle={{
            ...styles.taskWeightContent,
            paddingHorizontal: isWeighted ? "20%" : "16%",
          }}
          size="medium"
          onToggle={(state) => {
            setIsWeighted(state);
          }}
        />
      </View>

      <Text style={{ fontSize: 16 }}>Tree:</Text>
      <TreeView
        data={isWeighted ? [tree] : [UnweightedTree]}
        initialExpanded={true}
        renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
          return (
            <View key={node.task.id}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ marginLeft: 25 * level }}>
                  {getIndicator(isExpanded, hasChildrenNodes)}
                </Text>
                <Text style={{ color: "#9f402d", fontWeight: "bold" }}>
                  {node.task.name + " "}
                </Text>

                <ProgressChart
                  data={{ data: [node.progress] }}
                  width={20}
                  height={20}
                  strokeWidth={3}
                  radius={8}
                  hideLegend={true}
                  chartConfig={{
                    // backgroundGradientFrom: "#A4B6B6",
                    backgroundGradientFromOpacity: 0,
                    // backgroundGradientTo: "#A4B6B6",
                    backgroundGradientToOpacity: 0,

                    // color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    color: (opacity = 1) => `rgba(0,245,255,${opacity})`,

                    strokeWidth: 3, // optional, default 3
                    barPercentage: 1,
                  }}
                />
                <View
                  style={{
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: -20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 6,
                      // color: "rgba(26,255,146,1)",
                      color: "white",
                    }}
                  >
                    {Math.round(node.progress * 100)}%
                  </Text>
                </View>
              </View>
              <Text style={{ marginLeft: 30 * level }}>
                Received Points:{" "}
                {node.rcvPts == -1 ? null : Math.round(node.rcvPts * 100) / 100}{" "}
              </Text>
              <Text style={{ marginLeft: 30 * level }}>
                Possible Points:{" "}
                {node.possiblePts == -1
                  ? null
                  : Math.round(node.possiblePts * 100) / 100}
              </Text>
              <Text style={{ marginLeft: 30 * level }}>
                weight:{" "}
                {node.weight == -1
                  ? null
                  : Math.round(node.weight * 10000) / 100 + "%"}
              </Text>
              <Text style={{ marginLeft: 30 * level }}>
                score: {Math.round(node.score * 10000) / 100}%
              </Text>
              <Text style={{ marginLeft: 30 * level }}>
                weighted score: {Math.round(node.wScore * 10000) / 100}%
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  taskWeightContainer: {
    marginBottom: 20,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "#727A83",
    backgroundColor: "#A4B6B6",
    // opacity: 0.8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  taskWeightContent: {
    marginLeft: 10,
    marginBottom: 10,
    color: "#9f402d",
    fontWeight: "bold",
  },
});
