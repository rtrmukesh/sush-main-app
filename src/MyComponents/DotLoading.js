// DotLoading.js
import React, { useState, useEffect } from "react";
import { Animated, Easing, View, StyleSheet } from "react-native";

const DotLoading = () => {
  const [loadingDots] = useState([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);

  const startDotAnimation = () => {
    loadingDots.forEach((dot, index) => {
      Animated.loop(
        Animated.timing(dot, {
          toValue: 1,
          duration: 500,
          delay: index * 200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    });
  };

  useEffect(() => {
    startDotAnimation();
    return () => loadingDots.forEach((dot) => dot.stopAnimation());
  }, []);

  return (
    <View style={styles.loadingContainer}>
      {loadingDots.map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              opacity: dot.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom:8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    marginHorizontal: 4,
  },
});

export default DotLoading;
