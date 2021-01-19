import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Button as PButton } from "react-native-paper";
import { theme } from "../styles/theme";

const styles = StyleSheet.create({
  button: {
    width: "100%",
    marginVertical: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});

const Button = ({ mode, style, children, ...props }) => (
  <PButton
    style={[
      styles.button,
      mode === "outlined" && { backgroundColor: theme.colors.buttonColor },
      style,
    ]}
    labelStyle={[
      styles.text,
      mode === "contained" && { color: theme.colors.buttonColor },
    ]}
    mode={mode}
    {...props}
  >
    {children}
  </PButton>
);

export default memo(Button);
