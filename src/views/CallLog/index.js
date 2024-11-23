import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet
} from 'react-native';

import CallLogs from 'react-native-call-log';
import LogList from './components/LogList';

const CallLogScreen = () => {
  const [listData, setListDate] = useState([]);

  useEffect(() => {
  
    
    fetchData();
  }, []);

  const fetchData = async () => {
    if (Platform.OS !== 'ios') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG
        );
  
        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
            {
              title: 'Call Log Permission',
              message: 'This app needs access to your call logs.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
  
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            alert('Call Log permission denied');
            return;
          }
        }
        const logs = await CallLogs.loadAll();
        setListDate(logs);
      } catch (e) {
        console.error('Error fetching call logs:', e);
        alert('An error occurred while fetching call logs.');
      }
    } else {
      alert('Call logs are not supported on iOS.');
    }
  };



  return (
    <SafeAreaView style={styles.container}>
        <LogList
          data={listData}
        />
    </SafeAreaView>
  );
};

export default CallLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    fontSize: 16,
    marginVertical: 10,
  },
});