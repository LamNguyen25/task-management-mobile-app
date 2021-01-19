import { StyleSheet, Dimensions } from "react-native";
import { DefaultTheme } from "@react-navigation/native";

export const colors = {
  purple: "#7400bb",
  frenchViolet: "#6930c3",
  stateBlue: "#5e60ce",
  tuftsBlue: "#5390d9",
  blueJeans: "#4ea8de",
  vividSkyBlue: "#48bfe3",
  skyBlueCrayola: "#56cfe1",
  mediumTurquoise: "#64dfdf",
  turquoise: "#72efdd",
  aquamarine: "#80ffdb",
  periwinkleCrayola: "#c5d1eb",
  wildBlueYonder: "#92afd7",
  background: "#fafafa",
  warning: "#e91e63",
  white: "#fcfcfc",
  gray: "gray",
  boarderInput: "#8A8f9e",
  taskBackground: "#caf0f8",
  taskShadow: "#ade8f4",
  orange: "#ff9d5c",
  green: "#a8dd9d",
};

const center = {
  justifyContent: "center",
  alignItems: "center",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...center,
  },
  center: { ...center },
  background: {
    width: "100%",
    height: "100%",
  },
  error: {
    height: 72,
    ...center,
  },
  errorMessage: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  form: {
    width: "80%",
  },
  inputContainer: {},
  inputText: {
    borderBottomColor: colors.boarderInput,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    textAlign: "center",
    marginVertical: "5%",
  },
  forgotPasswordContainer: {
    marginTop: "5%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    height: 52,
    backgroundColor: colors.mediumTurquoise,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  otherSigninButtons: {
    ...center,
  },

  googleButton: {
    backgroundColor: colors.mediumTurquoise,
    borderRadius: 50,
    width: 40,
    height: 40,
    ...center,
  },
  googleIcon: {
    width: 30,
    height: 30,
    resizeMode: "stretch",
  },
  signupContainer: {
    ...center,
    flexDirection: "row",
    marginBottom: "10%",
  },
  profilePicContainer: {
    height: "20%",
    marginTop: "5%",
    borderRadius: 100,
  },
  profilePic: {
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  userInfo: {
    height: "5%",
    marginTop: "20%",
    flexDirection: 'column',
    marginBottom: "15%",
    // alignContent: 'center'
  },
  accountOptionsContainer: {},
  accountOptionsHeader: {},
  optionsHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.gray,
  },
  accountOptionsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "flex-start",
  },
  bullet: {
    fontSize: 40,
    color: colors.mediumTurquoise,
    marginRight: "5%",
  },
  textRow: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.gray,
  },
  //List styles
  listContainer: {
    flex: 1,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
    backgroundColor: colors.vividSkyBlue,
  },
  item: {
    padding: 10,
    fontSize: 30,
    width: Dimensions.get("window").width,
    flexShrink: 1,
    color: colors.white,
    borderWidth: 2,
    borderColor: colors.periwinkleCrayola,
  },
  header: {
    color: colors.mediumTurquoise,
    fontSize: 30,
    fontWeight: "bold",
    flexShrink: 1,
    width: Dimensions.get("window").width,
    textAlign: "center",
  },
  //List Styles
  //Reset Password Styles//
  resetContainer: {
    flex: 1,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
  },
  resetTopContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  resetCenterContainer: {
    flex: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 25,
  },
  resetBottomContainer: {
    flex: 1,
    width: "100%",
  },
  resetTitle: {
    color: colors.mediumTurquoise,
    fontSize: 20,
    fontWeight: "bold",
  },
  resetInputLabel: {
    color: "#000000",
    fontSize: 12,
    marginTop: 10,
    fontWeight: "bold",
  },
  resetError: {
    fontSize: 11,
    color: "red",
    paddingHorizontal: 4,
  },
  //Reset Password Styles
  menuIcon: {
    fontSize: 32,
    color: colors.white,
    marginLeft: 15,
  },
  searchIcon: {
    fontSize: 32,
    color: colors.white,
    marginHorizontal: 15,
  },
  backIcon: {
    fontSize: 32,
    color: colors.white,
    marginLeft: 15,
  },
  searchBar: {
    flexDirection: "row",
    height: "10%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: colors.background,
    shadowOffset: { width: 0, height: 10 }, //iOS: similar to elevation on android
    shadowOpacity: 0.05, //iOS: how intense the shadow is
    elevation: 10, //for android
  },

  searchBarHeader: {
    color: colors.gray,
    fontSize: 20,
  },
  searchBarInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.boarderInput,
    borderRadius: 30,
    width: "55%",
    height: "50%",
    textAlign: "center",
    fontSize: 16,
  },
  searchBarButtonContainer: {
    backgroundColor: colors.skyBlueCrayola,
    borderRadius: 30,
    height: "50%",
    ...center,
  },
  searchResultsHeader: {
    alignSelf: "center",
    fontSize: 20,
    color: colors.gray,
    fontWeight: "bold",
    marginBottom: "5%",
  },
  taskListContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: colors.background,
  },
  taskContainer: {
    padding: 20,
    backgroundColor: colors.taskBackground,
    borderColor: colors.taskBackground,
    borderWidth: 1,
    margin: 10,
    borderRadius: 10,
    shadowOffset: { width: 4, height: 4 },
    shadowColor: colors.taskShadow,
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
});

export const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.periwinkleCrayola, //menu highlight: when a menu item is clicked
    background: colors.background, //page background
    card: colors.skyBlueCrayola, //header
    text: colors.white, //menu text color
    border: colors.periwinkleCrayola, //
    notification: colors.warning,
  },
};
