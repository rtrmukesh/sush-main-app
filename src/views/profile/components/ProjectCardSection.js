import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
    Animated,
    Easing,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const ProjectCardSection = () => {
    const cards = [
        {
            id: 1,
            title: "One Portal",
            description: "Jul 2022 - Present",
            image: "https://sugamukesh.s3.eu-north-1.amazonaws.com/oneportal.jpeg",
        },
    ];

    const scaleValue = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.timing(scaleValue, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
        }).start();
    };

    const animatedStyle = {
        transform: [{ scale: scaleValue }],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Experience</Text>

            {cards.map((card) => (
                <View key={card.id} style={styles.card}>
                    <Image source={{ uri: card.image }} style={styles.cardImage} />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Text style={styles.cardDescription}>{card.description}</Text>

                        {/* Button with gradient and animation */}
                        <Animated.View style={[animatedStyle]}>
                            <TouchableOpacity
                                style={styles.viewButtonContainer}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={() => {
                                    // Add the button's action here
                                    console.log('View button clicked');
                                }}
                            >
                                <LinearGradient
                                    colors={["#0400ff", "#4ce3f7"]}
                                    start={[0.1, 0.1]}
                                    end={[1, 1]}
                                    style={styles.viewButton}
                                >
                                    <Text style={styles.viewButtonText}>View</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
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
        width: 100,
        height: 100,
        borderRadius: 10,
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
        marginBottom: 10,
    },
    viewButtonContainer: {
        borderRadius: 20,
        overflow: "hidden",
    },
    viewButton: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 20,
        width: 100,
    },
    viewButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default ProjectCardSection;
