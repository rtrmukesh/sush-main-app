import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';  

const ExpCardSection = () => {
  const cards = [
    {
      id: 1,
      title: "C programming",
      description: "Jan 2022 - Mar 2022",
      image: "https://sugamukesh.s3.eu-north-1.amazonaws.com/c-programing.png",
    },
    {
      id: 2,
      title: "Software Engineer",
      description: "Jul 2022 - Present",
      image: "https://sugamukesh.s3.eu-north-1.amazonaws.com/thidiff.png",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Experience</Text>

      {cards.map((card) => (
        <TouchableOpacity key={card.id} style={styles.card}>
          <Image source={{ uri: card.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </View>
          <Icon name="briefcase" size={24} color="#666" style={styles.briefcaseIcon} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: width > 600 ? 24 : 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "left",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 13,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  briefcaseIcon: {
    marginLeft: 'auto', 
  },
});

export default ExpCardSection;
