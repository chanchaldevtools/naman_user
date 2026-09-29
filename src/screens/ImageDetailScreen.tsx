import AppStatusBar from '../components/AppStatusBar';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {AppColors} from '../theme/colors';

type ImageDetailRouteProp = RouteProp<RootStackParamList, 'ImageDetail'>;

const ImageDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ImageDetailRouteProp>();
  const {imageUrl, title} = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppStatusBar />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle} numberOfLines={1}>
          Name - {title}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="contain"
            defaultSource={require('../../assets/images/loading.gif')}
          />
        ) : (
          <Text style={styles.noImageText}>No image available</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  appBar: {
    height: 56,
    backgroundColor: AppColors.themeColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
  },
  backBtn: {
    paddingRight: 16,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImageText: {
    color: '#888888',
    fontSize: 16,
  },
});

export default ImageDetailScreen;
