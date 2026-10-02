import AppStatusBar from '../components/AppStatusBar';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {RootStackParamList} from '../navigation/AppNavigator';
import {useAuthStore} from '../store/authStore';
import {useUserStore} from '../store/userStore';
import {useHelpStore} from '../store/helpStore';
import {useOfficerStore} from '../store/officerStore';
import {useVisitStore} from '../store/visitStore';
import {AppColors} from '../theme/colors';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavProp>();

  const {userType, sessionData, logout} = useAuthStore();

  const {
    userList,
    newUserRequestList,
    acceptedList,
    rejectedList,
    getUserList,
  } = useUserStore();

  const {
    helpList,
    newHelpList,
    solvedHelpList,
    rejectedHelpList,
    getHelpList,
  } = useHelpStore();

  const {officerList, getOfficerList} = useOfficerStore();
  const {visitList, getAllVisitList} = useVisitStore();

  const loadAllData = () => {
    getUserList();
    getHelpList();

    if (userType !== 'of') {
      getOfficerList();
    }

    getAllVisitList();
  };

  useEffect(() => {
    loadAllData();
  }, [userType]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();

          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppStatusBar />

      {/* Top App Bar */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeading}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.appBarLogo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.appBarTitle}>NAMAN by ADPC</Text>

        <View style={styles.appBarActions}>
          {/* Refresh */}
          <TouchableOpacity
            onPress={loadAllData}
            style={styles.iconBtn}
            activeOpacity={0.7}>
            <MaterialIcons name="refresh" size={25} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.iconBtn}
            activeOpacity={0.7}>
            <MaterialIcons name="logout" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        {userType === 'of' ? (
          <View style={styles.officerCard}>
            {sessionData.officerName ? (
              <View style={styles.profileRow}>
                <MaterialIcons
                  name="person"
                  size={22}
                  color={AppColors.themeColor}
                />

                <Text style={styles.officerName}>
                  {sessionData.officerName}
                </Text>
              </View>
            ) : null}

            {sessionData.designation ? (
              <View style={styles.profileDetailRow}>
                <MaterialIcons name="badge" size={18} color="#555555" />

                <Text style={styles.officerSub}>
                  Designation - {sessionData.designation}
                </Text>
              </View>
            ) : null}

            {sessionData.mobileNumber ? (
              <View style={styles.profileDetailRow}>
                <MaterialIcons name="phone" size={18} color="#555555" />

                <Text style={styles.officerDetail}>
                  Mobile - {sessionData.mobileNumber}
                </Text>
              </View>
            ) : null}

            {sessionData.psName ? (
              <View style={styles.profileDetailRow}>
                <MaterialIcons
                  name="local-police"
                  size={18}
                  color="#555555"
                />

                <Text style={styles.officerDetail}>
                  Station - {sessionData.psName}
                </Text>
              </View>
            ) : null}

            {sessionData.userName ? (
              <View style={styles.profileDetailRow}>
                <MaterialIcons
                  name="account-circle"
                  size={18}
                  color="#555555"
                />

                <Text style={styles.officerDetail}>
                  UserName - {sessionData.userName}
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <ImageBackground
            source={require('../../assets/images/flag.jpg')}
            style={styles.stationCard}
            imageStyle={{
              borderRadius: 8,
              opacity: 0.85,
            }}>
            <View style={styles.stationOverlay}>
              {sessionData.psName ? (
                <View style={styles.stationTitleRow}>
                  <MaterialIcons
                    name="local-police"
                    size={25}
                    color="#000000"
                  />

                  <Text style={styles.stationTitle}>
                    {sessionData.psName}
                  </Text>
                </View>
              ) : null}

              {sessionData.inchargeName ? (
                <View style={styles.stationInfoRow}>
                  <MaterialIcons name="person" size={18} color="#222222" />

                  <Text style={styles.stationSub}>
                    {sessionData.inchargeName}
                  </Text>
                </View>
              ) : null}

              {sessionData.mobileNumber ? (
                <View style={styles.stationInfoRow}>
                  <MaterialIcons name="phone" size={17} color="#222222" />

                  <Text style={styles.stationDetail}>
                    Registered Mobile - {sessionData.mobileNumber}
                  </Text>
                </View>
              ) : null}

              {sessionData.altNumber ? (
                <View style={styles.stationInfoRow}>
                  <MaterialIcons
                    name="phone-in-talk"
                    size={17}
                    color="#222222"
                  />

                  <Text style={styles.stationDetail}>
                    Alternative Number - {sessionData.altNumber}
                  </Text>
                </View>
              ) : null}

              {sessionData.emailId ? (
                <View style={styles.stationInfoRow}>
                  <MaterialIcons name="email" size={17} color="#222222" />

                  <Text style={styles.stationDetail}>
                    Email - {sessionData.emailId}
                  </Text>
                </View>
              ) : null}

              <View style={styles.stationInfoRow}>
                <MaterialIcons
                  name="account-balance"
                  size={17}
                  color="#222222"
                />

                <Text style={styles.stationDetail}>
                  Station Type -{' '}
                  {sessionData.stationType === '1'
                    ? 'PS (Police Station)'
                    : 'IC (Investigation Center)'}
                </Text>
              </View>

              {sessionData.area ? (
                <View style={styles.stationInfoRow}>
                  <MaterialIcons
                    name="location-on"
                    size={17}
                    color="#222222"
                  />

                  <Text style={styles.stationDetail}>
                    Area - {sessionData.area}
                  </Text>
                </View>
              ) : null}

              {sessionData.city ? (
                <View style={styles.stationInfoRow}>
                  <MaterialIcons
                    name="location-city"
                    size={17}
                    color="#222222"
                  />

                  <Text style={styles.stationDetail}>
                    City - {sessionData.city}
                  </Text>
                </View>
              ) : null}

              {sessionData.state ? (
                <View style={styles.stationInfoRow}>
                  <MaterialIcons name="map" size={17} color="#222222" />

                  <Text style={styles.stationDetail}>
                    State - {sessionData.state}, India
                  </Text>
                </View>
              ) : null}
            </View>
          </ImageBackground>
        )}

        {/* 3 Circular Stat Buttons */}
        <View style={styles.circleRow}>
          {/* Total Users */}
          <TouchableOpacity
            style={[styles.statCircle, {borderColor: '#FF5722'}]}
            onPress={() => navigation.navigate('SearchUser')}
            activeOpacity={0.7}>
            <MaterialIcons name="people" size={25} color="#FF5722" />

            <Text style={[styles.statTitle, {color: '#FF5722'}]}>
              Total User
            </Text>

            <Text style={[styles.statCount, {color: '#FF5722'}]}>
              {userList.length}
            </Text>
          </TouchableOpacity>

          {/* Total Help */}
          <TouchableOpacity
            style={[styles.statCircle, {borderColor: '#536DFE'}]}
            onPress={() => navigation.navigate('TotalHelpRequest')}
            activeOpacity={0.7}>
            <MaterialIcons
              name="support-agent"
              size={25}
              color="#536DFE"
            />

            <Text style={[styles.statTitle, {color: '#536DFE'}]}>
              Total Help
            </Text>

            <Text style={[styles.statCount, {color: '#536DFE'}]}>
              {helpList.length}
            </Text>
          </TouchableOpacity>

          {/* Total Visit */}
          <TouchableOpacity
            style={[styles.statCircle, {borderColor: '#4CAF50'}]}
            onPress={() => navigation.navigate('Visit')}
            activeOpacity={0.7}>
            <MaterialIcons name="groups" size={25} color="#4CAF50" />

            <Text style={[styles.statTitle, {color: '#4CAF50'}]}>
              Total Visit
            </Text>

            <Text style={[styles.statCount, {color: '#4CAF50'}]}>
              {visitList.length}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Officer Panel + Messages — ek hi line me */}
        <View style={styles.gridRow}>
          {/* Officer Panel — sirf PS/IC ke liye */}
          {userType !== 'of' && (
            <TouchableOpacity
              style={[styles.gridCard, {backgroundColor: '#536DFE'}]}
              onPress={() => navigation.navigate('OfficerPanel')}
              activeOpacity={0.8}>
              <MaterialIcons name="badge" size={30} color="#FFFFFF" />

              <Text style={styles.cardTitle}>OFFICER{'\n'}PANEL</Text>

              <Text style={styles.cardNumber}>{officerList.length}</Text>
            </TouchableOpacity>
          )}

          {/* Messages — count nahi chahiye */}
          <TouchableOpacity
            style={[
              styles.gridCard,
              {backgroundColor: '#25D366'},
              userType === 'of' && {flex: 1},
            ]}
            onPress={() => navigation.navigate('ChatList')}
            activeOpacity={0.8}>
            <MaterialIcons name="chat" size={30} color="#FFFFFF" />

            <Text style={styles.cardTitle}>MESSAGES</Text>
          </TouchableOpacity>
        </View>

        {/* New User / Active Users */}
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={[styles.gridCard, {backgroundColor: '#FF9800'}]}
            onPress={() => navigation.navigate('NewUserList')}
            activeOpacity={0.8}>
            <MaterialIcons name="person-add" size={30} color="#FFFFFF" />

            <Text style={styles.cardTitle}>New User Requests</Text>

            <Text style={styles.cardNumber}>
              {newUserRequestList.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, {backgroundColor: '#4CAF50'}]}
            onPress={() => navigation.navigate('ActiveUserList')}
            activeOpacity={0.8}>
            <MaterialIcons name="people" size={30} color="#FFFFFF" />

            <Text style={styles.cardTitle}>Active Users</Text>

            <Text style={styles.cardNumber}>{acceptedList.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Rejected Users / New Help */}
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={[styles.gridCard, {backgroundColor: '#F44336'}]}
            onPress={() => navigation.navigate('RejectedUserList')}
            activeOpacity={0.8}>
            <MaterialIcons name="person-off" size={30} color="#FFFFFF" />

            <Text style={styles.cardTitle}>Rejected Users</Text>

            <Text style={styles.cardNumber}>{rejectedList.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, {backgroundColor: '#2196F3'}]}
            onPress={() => navigation.navigate('NewHelpRequest')}
            activeOpacity={0.8}>
            <MaterialIcons
              name="support-agent"
              size={30}
              color="#FFFFFF"
            />

            <Text style={styles.cardTitle}>New Help Requests</Text>

            <Text style={styles.cardNumber}>{newHelpList.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Solved Help / Rejected Help */}
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={[styles.gridCard, {backgroundColor: '#009688'}]}
            onPress={() => navigation.navigate('SolvedHelp')}
            activeOpacity={0.8}>
            <MaterialIcons name="task-alt" size={30} color="#FFFFFF" />

            <Text style={styles.cardTitle}>Solved Help Requests</Text>

            <Text style={styles.cardNumber}>{solvedHelpList.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, {backgroundColor: '#E91E63'}]}
            onPress={() => navigation.navigate('RejectedHelp')}
            activeOpacity={0.8}>
            <MaterialIcons name="cancel" size={30} color="#FFFFFF" />

            <Text style={styles.cardTitle}>Rejected Help Requests</Text>

            <Text style={styles.cardNumber}>
              {rejectedHelpList.length}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 30}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  appBar: {
    height: 56,
    backgroundColor: AppColors.themeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  appBarLeading: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  appBarLogo: {
    width: 32,
    height: 32,
  },

  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  appBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    padding: 6,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },

  /* Officer Profile */
  officerCard: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    alignItems: 'center',
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  officerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 7,
  },

  officerSub: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 6,
  },

  officerDetail: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#444444',
    marginLeft: 6,
  },

  /* Police Station Card */
  stationCard: {
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  stationOverlay: {
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    alignItems: 'center',
  },

  stationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },

  stationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginLeft: 7,
  },

  stationInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },

  stationSub: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    marginLeft: 5,
  },

  stationDetail: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222222',
    marginLeft: 5,
    textAlign: 'center',
  },

  /* Circular Stats */
  circleRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 16,
    paddingHorizontal: 8,
  },

  statCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },

  statTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 2,
  },

  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },

  /* Officer Panel / Long Cards */
  longCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  cardTextContainer: {
    flex: 1,
    alignItems: 'center',
  },

  /* Grid */
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 10,
  },

  gridCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 8,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },

  cardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 6,
  },
});

export default HomeScreen;