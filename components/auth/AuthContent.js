import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";

import { useNavigation } from "@react-navigation/native";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
    name: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }

  function submitHandler(credentials) {
    let { name, email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const nameIsValid = !name
      .trim()
      .includes("@", "-", ",", "!", "`", "{", "}");
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !nameIsValid ||
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      let message, error;
      if (!emailIsValid) {
        error = "Invalid Email";
        message = "Please check the email that you have entered!";
      } else if (!emailsAreEqual) {
        error = "Unmatching Emails";
        message = "The emails you entered don't match!";
      } else if (!passwordIsValid) {
        error = "Invalid Password";
        message =
          "The password should at least be more than 6 characters long!";
      } else if (!passwordsAreEqual) {
        error = "Unmatching Passwords";
        message = "The passwords you entered don't match!";
      }
      Alert.alert(error, message);
      setCredentialsInvalid({
        email: !emailIsValid,
        name: !nameIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password, name });
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? "Create account" : "Log in instead"}
        </FlatButton>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
