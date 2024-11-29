import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import ArrayList from "../lib/ArrayList";
import { Color } from '../helper/Color';

const initialLayout = { width: 500};
const tabWidthMultiplier = 8;

const Tab = (props) => {
  let { title, setActiveTab, defaultTab } = props;

  let routes = [];
  let sceneMap = {};

  let RenderComponent = () => <></>;

  if (ArrayList.isEmpty(routes)) {
    if (title && title.length > 0) {
      for (let i = 0; i < title.length; i++) {
        const { title: titleName, tabName } = title[i];

        routes.push({
          key: `component${i}`,
          title: titleName,
          tabName: tabName,
        });
        sceneMap[`component${i}`] = RenderComponent;
      }
    }
  }

  let defTab =
    defaultTab &&
    routes &&
    routes.length > 0 &&
    routes.findIndex((data) => data?.tabName === defaultTab);

  const [index, setIndex] = useState(defaultTab ? defTab : 0);

  const handleTabPress = (newIndex) => {
    console.log('newIndex>>>------------------------> ', newIndex);
    console.log('routes>>>------------------------> ', routes);
    const selectedTab = routes[newIndex].tabName;
    console.log('selectedTab>>>------------------------> ', selectedTab);
    setActiveTab && setActiveTab(selectedTab);
    setIndex(newIndex);
  };

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: Color.BLUE }}
        style={{ backgroundColor: Color.BLACK }}
        labelStyle={{ color: Color.BLACK }}
        scrollEnabled={title.length > 3} 
        pressColor="transparent"
        renderLabel={({ route, focused, color }) => (
          <TouchableOpacity
            onPress={() => handleTabPress(route?.key)}
            style={{
              width:
                title.length > 1
                  ? "100%"
                  : initialLayout.width / tabWidthMultiplier,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={1}
          >
            <Text style={{ color: color }}>{route?.title}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  const renderScene = SceneMap(sceneMap);

  return (
      <View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={handleTabPress}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
        />
      </View>
  );
};

export default Tab;
