import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Card, Title } from "react-native-paper";
import { Color } from "../helper/Color";
import Divider from "./Divider";
import Link from "./Link";
import ListCustomLoader from "./ListCustomLoader";

const CustomCard = ({
  title,
  children,
  rightContent,
  showViewAll,
  viewAllHander,
  onRefresh,
  isRefreshing
}) => {

  const handleRefresh = async () => {
    if (onRefresh) await onRefresh(); 
  };

  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        {title && <Title style={styles.title}>{title}</Title>}
        <View style={styles.rightSection}>
          {rightContent && <Text style={styles.rightContent}>{rightContent}</Text>}
          {onRefresh && <TouchableOpacity onPress={handleRefresh}>
            {isRefreshing ? (
              <ActivityIndicator size="small" color={Color.ACTIVE} />
            ) : (
              <Ionicons name="refresh-circle" size={28} color="gray" />
            )}
          </TouchableOpacity>}
          {showViewAll && <Link title="View All" onPress={viewAllHander} />}
        </View>
      </View>
      {title && <Divider />}
      {isRefreshing ? <ListCustomLoader /> :
        <Card.Content>{children}</Card.Content>}
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
    borderBottomWidth: 1,
    borderBottomColor: "#E5E4E2",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    paddingLeft: 15,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContent: {
    fontWeight: "bold",
    fontSize: 16,
    paddingRight: 10,
  },
});
