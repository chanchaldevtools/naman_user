import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ActiveUserListScreen from '../screens/ActiveUserListScreen';
import NewUserListScreen from '../screens/NewUserListScreen';
import RejectedUserListScreen from '../screens/RejectedUserListScreen';
import NewHelpRequestScreen from '../screens/NewHelpRequestScreen';
import TotalHelpRequestScreen from '../screens/TotalHelpRequestScreen';
import SolvedHelpScreen from '../screens/SolvedHelpScreen';
import RejectedHelpScreen from '../screens/RejectedHelpScreen';
import VisitScreen from '../screens/VisitScreen';
import AddVisitScreen from '../screens/AddVisitScreen';
import OfficerPanelScreen from '../screens/OfficerPanelScreen';
import RegisterStationScreen from '../screens/RegisterStationScreen';
import TotalUserScreen from '../screens/TotalUserScreen';
import SearchUserScreen from '../screens/SearchUserScreen';
import ImageDetailScreen from '../screens/ImageDetailScreen';
import RegisterUserScreen from '../screens/RegisterUserScreen';
import RegisterUserDetailsScreen from '../screens/RegisterUserDetailsScreen';
import ChatList from '../screens/ChatListScreen';
import ChatRoom from '../screens/ChatRoomScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  ActiveUserList: undefined;
  NewUserList: undefined;
  RejectedUserList: undefined;
  NewHelpRequest: undefined;
  TotalHelpRequest: undefined;
  SolvedHelp: undefined;
  RejectedHelp: undefined;
  Visit: undefined;
  AddVisit: {userId: string; name: string; age: string; address: string};
  OfficerPanel: undefined;
  RegisterStation: undefined;
  TotalUser: undefined;
  SearchUser: undefined;
  ImageDetail: {imageUrl: string; title: string};
  RegisterUser: undefined;
  RegisterUserDetails: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: '#FFFFFF'},
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ActiveUserList" component={ActiveUserListScreen} />
        <Stack.Screen name="NewUserList" component={NewUserListScreen} />
        <Stack.Screen
          name="RejectedUserList"
          component={RejectedUserListScreen}
        />
        <Stack.Screen
          name="NewHelpRequest"
          component={NewHelpRequestScreen}
        />
        <Stack.Screen
          name="TotalHelpRequest"
          component={TotalHelpRequestScreen}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatList}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
        />
        <Stack.Screen name="SolvedHelp" component={SolvedHelpScreen} />
        <Stack.Screen name="RejectedHelp" component={RejectedHelpScreen} />
        <Stack.Screen name="Visit" component={VisitScreen} />
        <Stack.Screen name="AddVisit" component={AddVisitScreen} />
        <Stack.Screen name="OfficerPanel" component={OfficerPanelScreen} />
        <Stack.Screen
          name="RegisterStation"
          component={RegisterStationScreen}
        />
        <Stack.Screen name="TotalUser" component={TotalUserScreen} />
        <Stack.Screen name="SearchUser" component={SearchUserScreen} />
        <Stack.Screen name="ImageDetail" component={ImageDetailScreen} />
        <Stack.Screen name="RegisterUser" component={RegisterUserScreen} />
        <Stack.Screen
          name="RegisterUserDetails"
          component={RegisterUserDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
