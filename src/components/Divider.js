import React from "react";
import { Divider } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Color } from "../helper/Color";

const CustomDivider = () => {
    return(
        <Divider style={styles.divider}/>
    )
}
export default CustomDivider;
const styles = StyleSheet.create({
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Color.ACTIVE,
    },
});