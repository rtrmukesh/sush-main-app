import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Title } from "react-native-paper";
import { Color } from "../helper/Color";
import Divider from "./Divider";
import Link from "./Link";

const CustomCard = ({
  title,
  children,
  rightContent,
  showViewAll,
  onPress,
  viewAllHander,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        {title && <Title style={styles.title}>{title}</Title>}
        {rightContent && (
          <Text style={styles.rightContent}>{rightContent}</Text>
        )}
        {showViewAll && <Link title="View All" onPress={viewAllHander} />}
      </View>
      {title && <Divider />}
      <Card.Content>{children}</Card.Content>
    </Card>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 0.5,
    borderColor: Color.ACTIVE,
    borderRadius: 10,
    paddingBottom: 3,
    backgroundColor: Color.WHITE,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth:1,
    borderBottomColor:"#E5E4E2"
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    paddingLeft: 15,
  },
  rightContent: {
    fontWeight: "bold",
    fontSize: 16,
    paddingRight: 10,
  },
});
