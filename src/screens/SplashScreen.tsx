import AppStatusBar from '../components/AppStatusBar';
import React, {useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useAuthStore} from '../store/authStore';
import {RootStackParamList} from '../navigation/AppNavigator';

type SplashNavProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashNavProp>();
  const loadSession = useAuthStore(s => s.loadSession);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const hasSession = await loadSession();

      if (hasSession) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, loadSession]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <AppStatusBar />

      {/* Splash Image */}
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/splash.jpeg')}
          style={styles.splashImage}
          resizeMode="cover"
        />

        {/* Loading Indicator */}
        <View style={styles.loader}>
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  splashImage: {
    width: '100%',
    height: '100%',
  },

  loader: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default SplashScreen;