import React, { memo } from "react";
import { View,Text, TouchableOpacity,} from 'react-native'
import { colors, styles } from "../styles/styles";
/************************************************************************************************
 * UI for when user password reset e-mail is sent successfully.
 ************************************************************************************************/

const ForgotPasswordSentUI = ({ navigation }) =>  {
    return (
      <View style={styles.resetContainer}>
        <View style={styles.resetTopContainer}/>
        <View style={styles.resetCenterContainer}>
            <View> 
                <Text style={styles.resetTitle}>Password Reset E-mail Sent Successfully!</Text>
                <Text style={styles.resetInputLabel}>An e-mail to reset your password has been sent. Please check your spam folder 
                if you do not see it in your inbox. {"\n"}</Text>
                <TouchableOpacity>
                <Text
                    style={{ color: colors.wildBlueYonder }}
                    onPress={() => {
                        navigation.navigate("Signin");
                    }}
                >
                SIGN IN
                </Text>
              </TouchableOpacity>
            </View>
        </View>
        <View style={styles.resetBottomContainer}/>
      </View>
    );
}

export default memo(ForgotPasswordSentUI);

