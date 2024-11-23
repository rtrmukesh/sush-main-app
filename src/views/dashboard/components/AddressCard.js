import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomCard from '../../../components/Card';

const AddressCard = (props) => {
  const [location, setLocation] = useState(null);
  const [detail, setDetail] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchMapData()
  }, []);

  const fetchMapData=async ()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    setIsRefreshing(true)
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    const { latitude, longitude } = location.coords;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'Sush/1.0',
          'Accept': 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        setDetail(data);
        setIsRefreshing(false)
      })
      .catch(error => {
        console.error('Error:', error);
        setIsRefreshing(false)
      });
  }

  const openMap = () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };
  return (
   
    <View>
      <CustomCard title={"Address"} onRefresh={fetchMapData} isRefreshing={isRefreshing}>
        <View style={styles.childran}>
          <View style={styles.row}>
            <Text style={styles.boldText}>Latitude:</Text>
            <Text style={styles.normalText}>{location?.coords?.latitude}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>Longitude:</Text>
            <Text style={styles.normalText}>{location?.coords?.longitude}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>Country:</Text>
            <Text style={styles.normalText}>{detail?.address?.country}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>State:</Text>
            <Text style={styles.normalText}>{detail?.address?.state}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>City:</Text>
            <Text style={styles.normalText}>{detail?.address?.city ? detail?.address?.city : detail?.address?.county}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>Area:</Text>
            <Text style={styles.normalText}>{detail?.address?.road ? detail?.address?.road :detail?.address?.suburb}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>Postcode:</Text>
            <Text style={styles.normalText}>{detail?.address?.postcode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.boldText}>State District:</Text>
            <Text style={styles.normalText}>{detail?.address?.state_district}</Text>
          </View>
          <TouchableOpacity onPress={openMap} style={styles.mapButton}>
            <MaterialCommunityIcons name={"map"} size={25} color="black" />
            <Text style={styles.mapButtonText}>View on Map</Text>
          </TouchableOpacity>
        </View>
      </CustomCard>
    </View>
  );
};

const styles = StyleSheet.create({
  childran: {
    paddingTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2, // Adjust spacing between rows as needed
  },
  normalText: {
    fontSize: 12,
    color: "blue",
    flex: 1,
    textAlign: 'right', // Align the value to the right
  },
  boldText: {
    fontWeight: "bold",
    color: "red",
    fontSize: 15,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 11,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  mapButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'blue',
  },
});

export default AddressCard;
