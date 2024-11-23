import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, View, TouchableOpacity } from 'react-native';
import { Color } from '../helper/Color';

const CustomSyncButton = ({ showSyncButton, isLoading = false, handleSync }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isLoading, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], 
  });

  const handleButtonClick = () => {
    if (!isLoading && handleSync) {
      handleSync();
    }
  };

  return (
    showSyncButton && (
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'center',
          marginRight:4
        }}
      >
        <TouchableOpacity
          onPress={handleButtonClick}
          disabled={isLoading} 
          style={{
            opacity: isLoading ? 0.5 : 1, 
          }}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <FontAwesome5
              name="sync"
              size={24}
              color={Color.ACTIONBAR_TEXT}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  );
};

export default CustomSyncButton;
