import {
  DrawerContentScrollView,
  createDrawerNavigator
} from '@react-navigation/drawer';
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";
import CustomDrawerItem from "../../components/CustomDrawerItem";
import Dashboard from "../dashboard/Dashboard";
import { version } from "../../../package.json";
import AvDownload from '../AvDownload';
import CallLogScreen from '../CallLog';
import GalleryDashboard from "../Gallery";
import AlbumImage from '../Gallery/components/AlbumImage';
import Profile from "../profile/index";
import StatusSaver from '../StatusSaver';
import PaymentRecevie from '../paymentReceive';
import AudioToVideo from '../AudioToVideo';
import Setting from '../Setting';
import HiddenFileScreen from '../hiddenFile';
import ClockScreen from '../PushNotification';
const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {
  const menuItems = [
    { name: "Dashboard", icon: "home" }, 
    { name: "Profile", icon: "account-circle" }, 
    { name: "Gallery", icon: "view-gallery" }, 
    { name: "AvDownload", icon: "download" }, 
    { name: "AudioToVideo", icon: "audio-video" }, 
    { name: "StatusSaver", icon: "whatsapp" }, 
    { name: "CallLogScreen", icon: "phone-log" }, 
    { name: "Clock", icon: "alarm" }, 
    { name: "PaymentRecevie", icon: "bank-transfer-in" }, 
    { name: "HiddenFile", icon: "lock" }, 
    // { name: "Setting", icon: "cellphone-settings" }, 
  ];



  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          justifyContent: "center",
          borderBottomWidth: 1,
          borderBottomColor: "gray",
          marginBottom: 2,
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#A3D700" />
        <View style={{ alignItems: "center", width: 100 }}>
          <Image
            source={require("../../../assets/images/sm.jpg")}
            style={{ width: 60, height: 60, borderRadius: 30 }}
          />
          <View style={{ marginLeft: 16, marginTop: 5, marginBottom: 5 }}>
            <Text style={{ fontWeight: "bold" }}>Mukesh M...</Text>
          </View>
        </View>
      </View>
      <CustomDrawerItem menuItems={menuItems} navigation={props.navigation}/>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          justifyContent: "center",
          borderTopWidth: 1,
          borderTopColor: "gray",
          marginTop: 2,
        }}
      >
        <View>
            <Text style={{ fontWeight: "bold" }}>{`Version: ${version}`}</Text>
          </View>
      </View>
    </DrawerContentScrollView>
  );
};

const NavBar = (props) => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props}  />}
    screenOptions={{
      headerStyle: { backgroundColor: '#A3D700' }, 
      headerTintColor: 'black', 
    }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Drawer.Screen name="Gallery" component={GalleryDashboard} options={{ headerShown: false }} />
      <Drawer.Screen name="AlbumImage" component={AlbumImage} options={{ headerShown: false }} />
      <Drawer.Screen name="AvDownload" component={AvDownload}  />
      <Drawer.Screen name="StatusSaver" component={StatusSaver}  />
      <Drawer.Screen name="CallLogScreen" component={CallLogScreen} />
      <Drawer.Screen name="PaymentRecevie" component={PaymentRecevie} />
      <Drawer.Screen name="AudioToVideo" component={AudioToVideo}  />
      <Drawer.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
      <Drawer.Screen name="HiddenFile" component={HiddenFileScreen} options={{ headerShown: false }} />
      {/* <Drawer.Screen name="Clock" component={ClockScreen} options={{ headerShown: false }} /> */} 
    </Drawer.Navigator>
  );
};

export default NavBar;
