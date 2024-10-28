import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorageObject from "../../lib/AsyncStorage";
import LoginService from "../../../services/LoginService";

const LoginPage=()=> {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation()

  useEffect(async ()=>{
    let session_id =  await AsyncStorageObject.getItem("session_token");
    if(!session_id){
      navigation.navigate("mydashboard")
    }else{
      navigation.navigate("Login")
    }

  },[])


  const handleLogin = async (values) => {
    let data = new FormData();
    data.append('email', email);
    data.append('password', password);
    await LoginService.login(data, async (res) => {
      if (res) {
        await AsyncStorageObject.setItem('session_token', res?.user?.token);
        if (res?.user?.token) {
          navigation.navigate('mydashboard');
        }
      }
    });

  };

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Login</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          name="email"
          placeholder="email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="default"
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'gray',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    borderColor:"gray",
    borderWidth: 1
  },
  inputText: {
    height: 50,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#a9aaff',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
});

export default LoginPage;
