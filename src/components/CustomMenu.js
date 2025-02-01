import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const MENU_ITEMS = [
  { route: "Dashboard", label: "Dashboard", icon: "home" },
  { route: "Profile", label: "Profile", icon: "account-circle" },
  { route: "Gallery", label: "Gallery", icon: "view-gallery" },
  // { route: "AvDownload", label:"AvDownload",icon: "download" }, 
  { route: "AudioToVideo", label: "Audio-converter", icon: "audio-video" },
  { route: "StatusSaver", label: "StatusSaver", icon: "whatsapp" },
  { route: "CallLogScreen", label: "CallLog", icon: "phone-log" },
  // { route: "Clock", label:"Clock",icon: "alarm" }, 
  { route: "PaymentRecevie", label: "QR Pay", icon: "bank-transfer-in" },
  { route: "HiddenFile", label: "HiddenFile", icon: "lock" },
  { route: "Setting", label: "Setting", icon: "cellphone-settings" },
];

const DashboardScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    if(buttonVisible){
      setTimeout(() => {
        setButtonVisible(false);
      }, 5000);
    }
  }, [buttonVisible]);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const bgOpacity = useSharedValue(0);
  const navigation = useNavigation();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0, 0, 0, ${bgOpacity.value})`,
  }));

  const toggleMenu = () => {
    if (isOpen) {
      scale.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(0, { duration: 200 });
      bgOpacity.value = withTiming(0, { duration: 300 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
      bgOpacity.value = withTiming(0.5, { duration: 300 });
    }
    setIsOpen(!isOpen);
    setButtonVisible(true);
  };

  const closeMenu = () => {
    if (isOpen) {
      scale.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(0, { duration: 200 });
      bgOpacity.value = withTiming(0, { duration: 300 });
      setIsOpen(false);
      setTimeout(() => {
        setButtonVisible(false);
      }, 5000);
    }
  };

  const openScreen = (screen) => {
    setIsOpen(false);

    scale.value = withSpring(0.5, { damping: 15, stiffness: 100 });
    opacity.value = withTiming(0, { duration: 300 });
    bgOpacity.value = withTiming(0, { duration: 300 });

    navigation.reset({
      index: 0,
      routes: [{ name: screen }],
    });
    };

  return (
    <View style={{justifyContent: "center", alignItems: "center" }}>
   {isOpen && <TouchableWithoutFeedback onPress={closeMenu}>
        <Animated.View style={[{
          position: "absolute",
          width: width,
          height: height * 2,
        }, bgAnimatedStyle]} />
      </TouchableWithoutFeedback>}

      {isOpen && (
        <Animated.View style={[{
          position: "absolute",
          width: width * 0.8,
          height: width * 0.8,
          backgroundColor: "rgba(0,0,0,0.8)",
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          top: height / 2 - (width * 2.1),
          left: width / 2 - (width * 0.4),
        }, animatedStyle]}>
          <FlatList
            data={MENU_ITEMS}
            numColumns={3}
            keyExtractor={(item) => item.route}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: width / 3 - 20, // Ensures 3 items per row
                  alignItems: "center",
                  paddingVertical: 15,
                }}
                onPress={() => openScreen(item.route)}
              >
                <MaterialCommunityIcons name={item.icon} size={32} color="#fff" />
                <Text style={{ color: "white", marginTop: 15, fontSize: 12, fontWeight: "300" }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />

        </Animated.View>
      )}

      {!isOpen && <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 50,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: buttonVisible ?  "black": "rgba(150, 150, 150, 0.8)" ,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={toggleMenu}
      >
        <MaterialCommunityIcons name="dots-grid" size={32} color="white" />
      </TouchableOpacity>}
    </View>
  );
};

export default DashboardScreen;
