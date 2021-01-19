import React, {useState, useEffect, useRef} from 'react';
import {View, Button, Platform, ViewComponent, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LocalStorage from "../entities/LocalStorage";
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';
// import Constants from 'expo-constants';
import { colors, styles } from "../styles/styles";

export default function ReminderUI ({startDate, route, navigation}) {
  const [date, setDate] = useState("");
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener);
  //     Notifications.removeNotificationSubscription(responseListener);
  //   };
  // }, []);

  // registerForPushNotificationsAsync = async() => {

  //   let token;
  //   if (Constants.isDevice) {
  //     const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //     console.log(token);
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }

  //   if (Platform.OS === 'android') {
  //     Notifications.setNotificationChannelAsync('default', {
  //       name: 'default',
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: '#FF231F7C',
  //     });
  //   }
  //   return token;
  // }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    if (mode == 'date') {
      LocalStorage.setReminderDate(currentDate);
    } else if (mode == 'time') {
      LocalStorage.setReminderTime(currentDate);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <View style={{padding: 20}}>
        <Button onPress={showDatepicker} title="Select date" color={colors.skyBlueCrayola}/>
      </View>
      <View style={{padding: 20}}>
        <Button onPress={showTimepicker} title="Select time" color={colors.skyBlueCrayola}/>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(startDate)}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={Date.now()}
        />
      )}
    </View>
  );
};