import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import LoginPage from './src/views/loginPage';
import Mydashboard from "./src/views/navBar/mydashboard";
// import Setting from "./src/views/setting";
// import CCTVPage from "./src/views/Cctv";
// import CheckMobileNumber from "./src/views/checkMobBusyOrNot";
// import ImageCarousel from "./src/views/imageCarousel";
import Profile from './src/views/profile';
import GalleryDashboard from './src/views/Gallery';
import AvDownload from './src/views/AvDownload';
import AudioToVideo from './src/views/AudioToVideo';
import AlbumImage from './src/views/Gallery/components/AlbumImage';
import StatusSaver from './src/views/StatusSaver';
import CallLogScreen from './src/views/CallLog';
const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Login'
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name='Login' component={LoginPage} />
          <Stack.Screen name='mydashboard' component={Mydashboard} />
          <Stack.Screen name='profile' component={Profile} />
          <Stack.Screen name='AvDownload' component={AvDownload} />
          <Stack.Screen name='AudioToVideo' component={AudioToVideo} />
          {/* <Stack.Screen name='Setting' component={Setting} />
          <Stack.Screen name='CheckMobile' component={CheckMobileNumber} />
          <Stack.Screen name='ImageCarousel' component={ImageCarousel} /> */}
          <Stack.Screen name='Gallery' component={GalleryDashboard} />
          <Stack.Screen name='AlbumImage' component={AlbumImage} />
          <Stack.Screen name="StatusSaver" component={StatusSaver} />
          <Stack.Screen name="CallLogScreen" component={CallLogScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
