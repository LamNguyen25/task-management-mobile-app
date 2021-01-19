import React from "react";
import { StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { RootStack } from "./src/navigations/navigations";
import DatabaseUI from "./src/bounderies/DatabaseUI";
import { appTheme } from "./src/styles/styles";

DatabaseUI.initializeApp();

export default function App() {
  return (
    <NavigationContainer theme={appTheme}>
      <StatusBar barStyle="light-content" />
      <RootStack />
    </NavigationContainer>
  );
}
