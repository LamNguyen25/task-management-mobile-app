import React from "react";
import { Button, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import LoadingUI from "../bounderies/LoadingUI";
import SigninUI from "../bounderies/SigninUI";
import SignupUI from "../bounderies/SignupUI";
import HomeUI from "../bounderies/HomeUI";
import AccountUI from "../bounderies/AccountUI";
import ChangeEmailUI from "../bounderies/ChangeEmailUI";
import ForgotPasswordUI from "../bounderies/ForgotPasswordUI";
import ForgotPasswordSentUI from "../bounderies/ForgotPasswordSentUI";
import ViewTasksUI from "../bounderies/ViewTasksUI";
import ArchiveUI from "../bounderies/ArchiveUI";
import EditItemUI from "../bounderies/EditItemUI";
import SearchUI from "../bounderies/SearchUI";
import ItemDetailsUI from "../bounderies/ItemDetailsUI";
import WeightedItemDetailsUI from "../bounderies/WeightedItemDetailsUI";
// import AddItemsUI from "../bounderies/AddItemsUI";
import AddEditTask from "../components/AddEditTask";
import { colors, styles } from "../styles/styles";
import BackButton from "../components/BackButton";
import SearchButton from "../components/SearchButton";
import HamburgerButton from "../components/HamburgerButton";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DrawerActions } from "@react-navigation/native";

const Stack = createStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerLeft: null }}>
      <Stack.Screen
        name="Home"
        component={HomeMenu}
        options={({ navigation }) => ({
          title: "Flantasking",
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerLeft: () => <HamburgerButton navigation={navigation} />,
          headerRight: () => <SearchButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetailsUI}
        options={(props) => ({
          headerTitle: "Task Details",
          headerTitleAlign: "center",
          headerLeft: () => <BackButton navigation={props.navigation} />,
        })}
      />
      <Stack.Screen
        name="WeightedItemDetailsUI"
        component={WeightedItemDetailsUI}
        options={(props) => ({
          headerTitle: "Weighted Score Calculations",
          headerTitleAlign: "center",
          headerLeft: () => <BackButton navigation={props.navigation} />,
        })}
      />
      <Stack.Screen
        name="EditItemUI"
        component={EditItemUI}
        options={(props) => ({
          headerTitle: "Edit Item",
          headerTitleAlign: "center",
          headerLeft: () => <BackButton navigation={props.navigation} />,
        })}
      />
      {/* <Stack.Screen
        name="AddItems"
        component={AddItemsUI}
        options={{ headerTitle: "New Task", headerTitleAlign: "center" }}
      /> */}
      <Stack.Screen name="AddEditTask" component={AddEditTask} />
      <Stack.Screen name="Signin" component={SigninUI} />
      <Stack.Screen
        name="ChangeEmail"
        component={ChangeEmailUI}
        options={() => ({
          headerTitle: "Changing Email",
          headerStyle: { backgroundColor: colors.warning },
        })}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ForgotPasswordUI}
        options={(props) => ({
          headerTitle: "Reset Password",
          headerTitleAlign: "center",
          headerLeft: () => <BackButton navigation={props.navigation} />,
        })}
      />
      <Stack.Screen
        name="ForgotPasswordSent"
        component={ForgotPasswordSentUI}
        options={{
          headerTitle: "Password Reset E-mail Sent",
          headerTitleAlign: "center",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchUI}
        options={(props) => ({
          headerTitle: "SEARCH",
          headerTitleAlign: "center",
          headerLeft: () => <BackButton navigation={props.navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen
        name="Signin"
        component={SigninUI}
        options={{
          headerTitle: "Sign In",
          headerTitleAlign: "center",
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupUI}
        options={{
          headerTitle: "Sign Up",
          headerTitleAlign: "center",
          headerLeft: null,
        }}
      />
      <Stack.Screen
        headerLeft={
          <Button
            title="Menu"
            onPress={(navigation) => {
              navigation.navigate("Signin");
            }}
          />
        }
        name="ForgotPassword"
        component={ForgotPasswordUI}
        options={{ headerTitle: "Forgot Password", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="ForgotPasswordSent"
        component={ForgotPasswordSentUI}
        options={{
          headerTitle: "Password Reset E-mail Sent",
          headerTitleAlign: "center",
          headerLeft: null,
        }}
      />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();
const HomeMenu = () => {
  return (
    <Drawer.Navigator>
      {/* <Drawer.Screen name="Home" component={HomeUI} options={{headerShown: false}} /> */}
      <Drawer.Screen
        name="View Tasks"
        component={ViewTasksUI}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Completed Tasks"
        component={ArchiveUI}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Account"
        component={AccountUI}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

const RootStack = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ gestureEnabled: false }}
    >
      <Stack.Screen name="Loading" component={LoadingUI} />
      <Stack.Screen name="App" component={AppStack} />
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
};

export { RootStack };
