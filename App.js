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
import PaymentRecevie from './src/views/paymentReceive';
import Setting from './src/views/Setting';
import HiddenFileScreen from './src/views/hiddenFile';
import DashboardScreen from './src/components/CustomMenu';
import Dashboard from './src/views/dashboard/Dashboard';
import AudioCutterScreen from './src/views/AudioCutter';
import PinterestDownloader from './src/views/Pinterest';
// import ClockScreen from './src/views/ClockScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Dashboard'
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: ({ current, next, inverted, layouts }) => {
              const progress = next ? next.progress : current.progress;
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen name='Login' component={LoginPage} />
          <Stack.Screen name='Dashboard' component={Dashboard} />
          {/* <Stack.Screen name='mydashboard' component={Mydashboard} /> */}
          <Stack.Screen name='Profile' component={Profile} />
          <Stack.Screen name='AvDownload' component={AvDownload} />
          <Stack.Screen name='AudioToVideo' component={AudioToVideo} />
          <Stack.Screen name='Setting' component={Setting} />
          {/*<Stack.Screen name='CheckMobile' component={CheckMobileNumber} />
          <Stack.Screen name='ImageCarousel' component={ImageCarousel} /> */}
          <Stack.Screen name='Gallery' component={GalleryDashboard} />
          <Stack.Screen name='AlbumImage' component={AlbumImage} />
          <Stack.Screen name="StatusSaver" component={StatusSaver} />
          <Stack.Screen name="CallLogScreen" component={CallLogScreen} />
          <Stack.Screen name="PaymentRecevie" component={PaymentRecevie} />
          <Stack.Screen name="HiddenFile" component={HiddenFileScreen} />
          <Stack.Screen name="AudioCutter" component={AudioCutterScreen} />
          <Stack.Screen name="Pinterest" component={PinterestDownloader} />
          {/* <Stack.Screen name="Clock" component={ClockScreen} /> */}

        </Stack.Navigator>
        <DashboardScreen />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
