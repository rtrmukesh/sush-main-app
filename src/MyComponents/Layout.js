import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'; // You can use any icon library
import ArrayList from "../lib/ArrayList";

const { width } = Dimensions.get("window");

const Layout = (props) => {
  let { HeaderLabel = "Mukesh Profile", footerContent, children, onBackPress, showFooter = true, showStatusBar = true, showHeader = true, actionMenu = [],handleHeaderClick } = props;
  let navigation = useNavigation();


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ✴---StatusBar---✴ */}
      {showStatusBar && <StatusBar barStyle="dark-content" backgroundColor="#A3D700" />}

      {/* ✴---Container---✴ */}
      <View style={styles.container}>

        {/* ✴---Header with Back Icon, Title, and Settings Icon---✴ */}
        {showHeader && <View style={styles.header}>
          <TouchableOpacity onPress={() => onBackPress ? onBackPress() : navigation.goBack()} style={styles.iconContainer}>
            <Icon name="arrow-back" size={24} color="black" />

          </TouchableOpacity>

          <Text onPress={() => handleHeaderClick && handleHeaderClick()} style={styles.headerText}>{HeaderLabel}</Text>

          <View style={{ flexDirection: "row" }}>
            {ArrayList.isArray(actionMenu) && actionMenu.map((menu) =>
              <TouchableOpacity onPress={menu?.onPress ? () => menu?.onPress() : () => { }} style={styles.iconContainer}>
                <MaterialCommunityIcons name={menu?.icon ? menu?.icon : "settings"} size={24} color="black" />
                <Text style={styles.label}>
                  {menu?.label ? menu?.label : "Add"}
                </Text>
              </TouchableOpacity>)}
          </View>
        </View>}

        {/* ✴---Body---✴ */}
        <ScrollView style={styles.body}>{children}</ScrollView>

        {/* ✴---Footer---✴ */}
        {showFooter && <View style={styles.footer}>
          <Text style={styles.footerText}>{footerContent}</Text>
        </View>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "gray",
  },
  label: {
    fontSize: 7, 
    color: 'black',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#F0F5FF",
  },
  header: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#A3D700"
  },
  headerText: {
    fontSize: width > 600 ? 24 : 18,
    fontWeight: 'bold',
    textAlign: "center",
    color: "#192838"
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  body: {
    flex: 1,
  },
  footer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: width > 600 ? 24 : 18,
    color: "#fff",
  },
});

export default Layout;
