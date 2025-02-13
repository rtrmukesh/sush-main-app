import React, { useState } from "react";
import { View, Switch, Text, StyleSheet } from "react-native";
import { NativeModules } from "react-native";

const { CustomModule } = NativeModules;

const AppHideScreen = () => {
    const [isHidden, setIsHidden] = useState(false);

    const toggleAppIcon = (value) => {
        setIsHidden(value);
        if (value) {
            CustomModule.hideAppIcon();
        } else {
            CustomModule.showAppIcon();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hide App Icon</Text>
            <Switch value={isHidden} onValueChange={toggleAppIcon} />
            <Text style={styles.note}>Press Volume Down 3 times to restore.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { fontSize: 18, marginBottom: 10 },
    note: { fontSize: 14, marginTop: 10, color: "gray" },
});

export default AppHideScreen;
