import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const PushNotificationComponent = () => {
  useEffect(() => {
    requestUserPermission();
    getToken();

    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('FCM Notification received in foreground:', remoteMessage);
      displayNotification(remoteMessage);
    });

    const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      let parseData = JSON.parse(remoteMessage.data.data)
      if (parseData?.isTicketDetailScreen) {
        // navigation.navigate("Ticket/Detail", { item: parseData })
      }
      console.log('Notification opened:', remoteMessage);
    });

    // Handle notifications when the app is launched from a killed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
        }
      });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('FCM Notification received in background:', remoteMessage);
      displayNotification(remoteMessage);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpened();
    };
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    } else {
      console.log('Notification permission denied');
    }
  };

  // Get FCM token
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    // Send this token to your backend if necessary
  };

  // Display a foreground notification using react-native-push-notification
  const displayNotification = async (remoteMessage) => {
    PushNotification.localNotification({
      title: remoteMessage.notification?.title || 'Default Title',
      message: remoteMessage.notification?.body || 'Default Body',
      playSound: true,
      soundName: 'default',
      // For Android: Add the small icon and channel ID as needed
      largeIcon: 'ic_launcher', // Ensure you have a valid icon in your app's drawable resources
      smallIcon: 'ic_launcher',
      channelId: 'default', // Make sure this channel exists
    });
  };

  // Create a default notification channel
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'default',
        channelName: 'Default Channel',
        channelDescription: 'A channel to categorise your notifications',
        playSound: true,
        soundName: 'default',
        importance: 4, // HIGH importance
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Push Notification Example</Text>
      <Button title="Get Token" onPress={getToken} />
    </View>
  );
};

export default PushNotificationComponent;
