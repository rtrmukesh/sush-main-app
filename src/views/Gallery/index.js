import React, { useState } from "react";
import MainGallery from "./components/MainGallery";
import Tab from "../../MyComponents/Tab";
import { View } from "react-native";
import { Color } from "../../helper/Color";
import Layout from "../../MyComponents/Layout";
import DateWiseGallery from "./components/DateWiseGallery";
import TabName from "../../helper/Tab";


const GalleryDashboard = () => {

  const [activeTab, setActiveTab] = useState(TabName.MAIN_GALLERY);

  let title = [
    {
      title: TabName.MAIN_GALLERY,
      tabName: TabName.MAIN_GALLERY
    },
    {
      title: TabName.DATE_WISE_GALLERY,
      tabName: TabName.DATE_WISE_GALLERY
    },
  ];


  return (
    <>
      <View style={{
        flexDirection: "row",
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: Color.LIGHT_GRAY,
      }}>
        <Tab
          title={title}
          setActiveTab={(e) => setActiveTab(e)}
          defaultTab={activeTab}
        />
      </View>
      <Layout HeaderLabel={activeTab}>
        {activeTab == TabName.MAIN_GALLERY && <MainGallery />}
        {activeTab == TabName.DATE_WISE_GALLERY && <DateWiseGallery />}
      </Layout>

    </>
  );
};



export default GalleryDashboard;
