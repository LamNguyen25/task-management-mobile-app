import React, { useState, memo } from "react";
import { View, TextInput, Text,} from 'react-native'
import { Button as PaperButton} from "react-native-paper";
import { colors, styles } from "../styles/styles";
import {sendPRemail} from "../controllers/AuthController"
import {
  emailValidator,
} from '../controllers/utils';

/************************************************************************************************
 * UI for when user forgets their password for their account. 
 ************************************************************************************************/

const ForgotPasswordUI = ({ navigation }) =>  {

    const [email, setEmail] = useState({ value: "", error: "" });
    const [loading, setLoading] = useState(false);

   _onForgotPasswordPressed = async () => {
     if(loading) 
     {
       return;
     }
     const emailError = emailValidator(email.value);
     if(emailError) {
      setEmail({ ...email, error: emailError });
      return;
     }

    setLoading(true);
    sendPRemail(email.value)
    .then(() =>
    {
        navigation.navigate("ForgotPasswordSent");
    })
    .catch((err) => 
      setEmail({...email, error: err.message.replace("identifier", "e-mail").replace("record", "account")})
    );
    setLoading(false);
   };

    return (
      <View style={styles.resetContainer}>
        <View style={styles.resetTopContainer}/>
        <View style={styles.resetCenterContainer}>
            <View> 
                    <Text style={styles.resetTitle}>Forgot Password</Text>
                    <Text style={styles.resetInputLabel}>Please enter your e-mail associated with your account. An e-mail will
                      to reset your password will be sent. Please be sure to check in your spam folder.</Text>
                    <Text style={styles.resetInputLabel}>Email</Text>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5 ,marginTop: 5, marginBottom: 10, color: '#000000'}}                    label = "Email"
                        value={email.value}
                        onChangeText={text => setEmail({ value: text, error: "" })}
                        error={!!email.error}
                        autoCapitalize="none"
                        autoCompleteType="email"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />
                     {email.error ? <Text style={styles.resetError}>{email.error}</Text> : null}

                    <PaperButton
                        loading={loading}
                        style={{marginTop: 24, color: '#ffffff', borderRadius: 15}}
                        mode="contained"
                        onPress={_onForgotPasswordPressed}
                        color = {colors.mediumTurquoise}
                    >
                      Send email to reset password
                    </PaperButton>
                </View>
        </View>
        <View style={styles.resetBottomContainer}/>
      </View>
    );
  // }
}

export default memo(ForgotPasswordUI);

