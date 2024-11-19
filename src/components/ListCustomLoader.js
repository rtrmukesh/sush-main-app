import React from "react";
import { View, Dimensions } from "react-native";
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Color } from "../helper/Color";

const ListCustomLoader = () => {
  const screenHeight = Dimensions.get('window').height;
  const itemHeight = 150;
  const itemCount = Math.floor(screenHeight / itemHeight); 
  const screenWidth = Dimensions.get('window').width;

  return (
    <View>
      {Array.from({ length: itemCount }).map((_, index) => {
        return (
          <View key={index}>
            <ContentLoader
              viewBox={`23.4 0 ${screenWidth} ${itemHeight}`}
              height={itemHeight}
              width={screenWidth}
              animate={true}
              rtl={false}
              speed={2}
              interval={0.01}
              foregroundColor={'#999'}
              backgroundColor={Color.LIGHT_GRAY}
            >
              <Rect
                width={screenWidth}
                height={itemHeight - 40} 
              />
            </ContentLoader>
          </View>
        );
      })}
    </View>
  );
};

export default ListCustomLoader;
