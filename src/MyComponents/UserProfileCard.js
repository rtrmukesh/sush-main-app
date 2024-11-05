import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const UserProfileCard = ({ imageUri, userName, showNameRight = false }) => {
  return (
    <View
      style={[
        styles.container,
        showNameRight ? styles.horizontalLayout : styles.verticalLayout,
      ]}
    >
      <Image source={{ uri: imageUri }} style={styles.profileImage} />
      <Text style={[styles.userName, showNameRight && styles.userNameRight]}>{userName}</Text>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalLayout: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, 
    marginBottom: 10, 
  },
  userName: {
    fontSize: width > 600 ? 24 : 18,
    color: '#000',
    fontWeight: 'bold',
  },
  userNameRight: {
    marginLeft: 15, 
    marginTop: -10, 
  },
});

export default UserProfileCard;
