import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Color } from "../helper/Color";
const Link = ({ onPress, title , size}) => {
  return (
    <TouchableOpacity onPress={onPress} >
      <Text style={[styles.title,{fontSize:size ? size : 13}]}>
        {title}
      </Text>
    </TouchableOpacity>
  )

}
const styles = StyleSheet.create({
  title: {
    color: Color.GREY,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingRight:15,
    textDecorationLine: 'underline'
  }
})
export default Link;

