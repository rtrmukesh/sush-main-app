import React from "react";
import Layout from "../../MyComponents/Layout";
import { ScrollView } from "react-native";
import UserProfileCard from "../../MyComponents/UserProfileCard";
import Description from "../../MyComponents/Description";
import ExpCardSection from "./components/ExpCardSection";
import ScrollableBadge from "../../MyComponents/ScrollableBadge";
import ProjectCardSection from "./components/ProjectCardSection";

const Profile = (props) => {


  const skills = ['JavaScript', 'React Native', 'Node.js', 'CSS', 'HTML', 'Redux', 'MongoDB', 'GraphQL', 'Express'];

  return (
    <Layout
    showFooter={false}
    >
      <ScrollView>
        <UserProfileCard
          imageUri="https://sugamukesh.s3.eu-north-1.amazonaws.com/1726828835360.jpg"
          userName="Mukesh Murugaiyan"
        />
        <Description
          description={
            "Full Stack Developer with 10+ years of experience in building scalable web applications and services. Proficient in JavaScript, Python, and cloud technologies."
          }
          descriptionFontSize={13}
        />
        <Description
          title="About Me"
          description={
            "I am a seasoned Full Stack Developer with a passion for creating efficient and scalable web applications. Over the past decade, I have honed my skills in various programming languages and frameworks, including JavaScript, Python, React, and Django. My expertise extends to cloud technologies such as AWS and Azure, where I have successfully deployed numerous applications. I am committed to continuous learning and staying updated with the latest industry trends to deliver cutting-edge solutions."
          }
        />
        <ExpCardSection/>
        <ScrollableBadge title={"Skill"} badgeArray={skills}/>
        <ProjectCardSection/>
      </ScrollView>
    </Layout>
  );
};

export default Profile;
