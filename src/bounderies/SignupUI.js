import React, { useState, memo } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { colors } from "../styles/styles";
import { registerNewUser } from "../controllers/AuthController";
import {
  emailValidator,
  passwordValidator,
  nameValidator,
} from "../controllers/utils";

const SignupUI = ({ navigation }) => {
  // render() {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setconfirmPassword] = useState({
    value: "",
    error: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  _onSignUpPressed = async () => {
    if (loading) return;

    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (password.value != confirmPassword.value) {
      setconfirmPassword({
        ...confirmPassword,
        error: "Password does not match",
      });
      return;
    }
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);

    const response = await registerNewUser({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    if (response.error) {
      setError(response.error);
    } else {
      navigation.navigate("View Tasks");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer} />
      <View style={styles.centerContainer}>
        <View>
          <Text style={styles.title}>Register to FlanTasking</Text>
          <Text style={styles.inputLabel}>Full Name</Text>

          <TextInput
            style={styles.textInput}
            label="Full Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            error={!!name.error}
          />
          {name.error ? <Text style={styles.error}>{name.error}</Text> : null}

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          {email.error ? <Text style={styles.error}>{email.error}</Text> : null}

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.textInput}
            returnKeyType="next"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            secureTextEntry
            autoCapitalize="none"
          />

          {password.error ? (
            <Text style={styles.error}>{password.error}</Text>
          ) : null}

          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.textInput}
            returnKeyType="done"
            value={confirmPassword.value}
            onChangeText={(text) =>
              setconfirmPassword({ value: text, error: "" })
            }
            error={!!confirmPassword.error}
            secureTextEntry
            autoCapitalize="none"
          />
          {confirmPassword.error ? (
            <Text style={styles.error}>{confirmPassword.error}</Text>
          ) : null}
          <PaperButton
            loading={loading}
            style={{ marginTop: 24, color: "#ffffff", borderRadius: 15 }}
            mode="contained"
            onPress={_onSignUpPressed}
            color={colors.mediumTurquoise}
          >
            SignUp
          </PaperButton>

          <View style={styles.row}>
            <Text style={{ color: "#000000" }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
              <Text style={styles.link}>SIGNIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer} />
    </View>
  );
  // }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  centerContainer: {
    flex: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 25,
  },
  bottomContainer: {
    flex: 1,
    width: "100%",
  },
  title: {
    color: colors.mediumTurquoise,
    fontSize: 20,
    fontWeight: "bold",
  },
  inputLabel: {
    color: "#000000",
    fontSize: 12,
    marginTop: 10,
  },
  error: {
    fontSize: 11,
    color: "red",
    paddingHorizontal: 4,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    color: "#000000",
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: colors.wildBlueYonder,
  },
});

export default memo(SignupUI);
