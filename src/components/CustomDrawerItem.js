import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";

function CustomDrawerItem(props) {
    let {menuItems}=props;

    const renderCustomItem = (item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => props.navigation.reset({
            index: 0, 
            routes: [{ name: item.name }], 
          })}
          style={{ flexDirection: "row", alignItems: "center", padding: 20 }}
        >
            <MaterialCommunityIcons name={item.icon} size={25} color="black" />
          <View style={{ marginLeft: 10 }}>
          <Text>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
  return (
    <View>
      {menuItems.map((item, index) => renderCustomItem(item, index))}
    </View>
  )
}

export default CustomDrawerItem
