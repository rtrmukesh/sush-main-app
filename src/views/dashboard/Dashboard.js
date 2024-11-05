// components/Dashboard.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AddressCard from './components/AddressCard';

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={[styles.hello,styles.text]}>Hello! <Text style={[styles.name,styles.text]}>Suganthi Mukesh</Text></Text>
      <View style={{marginTop:13}}>
      <AddressCard/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  childran:{
paddingTop:5
  },
  normalText:{
    fontSize:12,
    color:"blue"
  },
  boldText:{
fontWeight:"bold",
color:"red",
fontSize:15
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding:11
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  hello:{
    color:"red"
  },
  name:{
    color:"#003366"
  }
});

export default Dashboard;
