import AppStatusBar from '../components/AppStatusBar';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,

  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {launchImageLibrary} from 'react-native-image-picker';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useUserRegistrationStore} from '../store/userRegistrationStore';
import {AppColors} from '../theme/colors';

type RegUserNavProp = StackNavigationProp<RootStackParamList, 'RegisterUser'>;

const RegisterUserScreen = () => {
  const navigation = useNavigation<RegUserNavProp>();
  const {
    imageUri,
    hasCo,
    coName,
    coMobile,
    setField,
  } = useUserRegistrationStore();

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setField('imageUri', result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not pick image');
    }
  };

  const handleNext = () => {
    if (!imageUri) {
      Alert.alert('Please choose an image', 'You need to choose an image first.');
      return;
    }

    if (hasCo) {
      if (!coName.trim()) {
        Alert.alert('Required', 'Please enter Care of (C/O) Name.');
        return;
      }
      if (!coMobile.trim() || coMobile.length !== 10) {
        Alert.alert('Required', 'Mobile number should be in 10 digits.');
        return;
      }
    }

    navigation.navigate('RegisterUserDetails');
  };

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
        <Text style={styles.appBarTitle}>Add User</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>CREATE USER ACCOUNT</Text>

        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subTitle}>NAMAN by ADPC</Text>

        {/* Photo Picker */}
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={handlePickImage}>
          {imageUri ? (
            <Image source={{uri: imageUri}} style={styles.previewImage} />
          ) : (
            <Image
              source={require('../../assets/images/image.png')}
              style={styles.placeholderIcon}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
        <Text style={styles.imageHint}>
          {imageUri ? 'Tap to choose image again' : 'Choose user image'}
        </Text>

        {/* Has Care Of Toggle */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setField('hasCo', !hasCo)}>
          <View style={[styles.checkbox, hasCo && styles.checkboxChecked]}>
            {hasCo && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Has Care of (C/O) details?</Text>
        </TouchableOpacity>

        {/* C/O Details */}
        {hasCo && (
          <View style={styles.coContainer}>
            <Text style={styles.inputLabel}>Enter C/O (Care of name)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter C/O Name"
              placeholderTextColor="#999"
              value={coName}
              onChangeText={v => setField('coName', v)}
            />

            <Text style={styles.inputLabel}>Enter C/O Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter C/O Mobile Number"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={10}
              value={coMobile}
              onChangeText={v => setField('coMobile', v)}
            />
          </View>
        )}

        {/* Next Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appBar: {
    height: 56,
    backgroundColor: AppColors.themeColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.themeColor,
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 24,
  },
  imagePicker: {
    width: 180,
    height: 180,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#F9F9F9',
  },
  placeholderIcon: {
    width: 80,
    height: 80,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageHint: {
    fontSize: 13,
    color: '#666666',
    marginTop: 10,
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: AppColors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: AppColors.themeColor,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  coContainer: {
    width: '100%',
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.themeColorLight,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#FAFAFA',
  },
  nextBtn: {
    backgroundColor: AppColors.themeColor,
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterUserScreen;
