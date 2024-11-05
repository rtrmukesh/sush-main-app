import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Description = (props) => {
  const { title, description, titleFontSize, descriptionFontSize, lineHeight=4 } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0); 
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 0 : contentHeight, 
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onContentLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
    if (!isExpanded) {
      animatedHeight.setValue(height); 
    }
  };
  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { ...(titleFontSize ? { fontSize: titleFontSize } : {}) }]}>
          {title}
        </Text>
      )}

      <TouchableOpacity onPress={toggleDescription}>
        <Animated.View style={{ height: isExpanded ? animatedHeight + 1 : 80, overflow: 'hidden' }}>
          <Text
            style={[styles.description, { ...(descriptionFontSize ? { fontSize: descriptionFontSize } : {}) }]}
            numberOfLines={isExpanded ? undefined : lineHeight} 
            ellipsizeMode="tail" 
            onLayout={(e) => onContentLayout(e)} 
          >
            {description}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 2,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  title: {
    fontSize: width > 600 ? 24 : 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: width > 600 ? 18 : 16,
    color: '#333',
    fontFamily: 'Roboto',
    },
});

export default Description;
