import AppStatusBar from '../components/AppStatusBar';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useRegisterStore} from '../store/registerStore';
import {AppColors} from '../theme/colors';

type RegStationNavProp = StackNavigationProp<
  RootStackParamList,
  'RegisterStation'
>;

const RegisterStationScreen = () => {
  const navigation = useNavigation<RegStationNavProp>();
  const {
    isLoading,
    cityList,
    selectedCity,
    stationType,
    mobile,
    alternativeMobile,
    email,
    password,
    policeStation,
    incharge,
    area,
    pin,
    getCityList,
    registerStation,
    setField,
  } = useRegisterStore();

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCityList();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCity) {
      Alert.alert('Required', 'Please select a city.');
      return;
    }
    if (!policeStation.trim()) {
      Alert.alert('Required', 'Please enter police station name.');
      return;
    }
    if (!incharge.trim()) {
      Alert.alert('Required', 'Please enter in-charge name.');
      return;
    }
    if (!mobile.trim()) {
      Alert.alert('Required', 'Please enter registered mobile number.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Required', 'Please enter password.');
      return;
    }
    if (!pin.trim()) {
      Alert.alert('Required', 'Please enter pincode.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerStation();
      setSubmitting(false);
      if (res === 'ok') {
        Alert.alert('Success', 'Police Station registered successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        Alert.alert('Notice', res);
      }
    } catch (e) {
      setSubmitting(false);
      Alert.alert('Error', 'Failed to register station.');
    }
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
        <Text style={styles.appBarTitle}>Register Police Station</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>ENTER STATION DETAILS</Text>

        {/* City selection pills */}
        <Text style={styles.inputLabel}>Select City</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cityScroll}>
          {cityList.map(c => {
            const cityName = c.city_name || c.city || '';
            const isSelected = selectedCity === cityName;
            return (
              <TouchableOpacity
                key={c.id ?? cityName}
                style={[
                  styles.cityChip,
                  isSelected && styles.cityChipSelected,
                ]}
                onPress={() => setField('selectedCity', cityName)}>
                <Text
                  style={[
                    styles.cityChipText,
                    isSelected && styles.cityChipTextSelected,
                  ]}>
                  {cityName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Station Type (PS = 1, IC = 2) */}
        <Text style={styles.inputLabel}>Station Type</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              stationType === 1 && styles.typeBtnActive,
            ]}
            onPress={() => setField('stationType', 1)}>
            <Text
              style={[
                styles.typeBtnText,
                stationType === 1 && styles.typeBtnTextActive,
              ]}>
              Police Station (PS)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeBtn,
              stationType === 2 && styles.typeBtnActive,
            ]}
            onPress={() => setField('stationType', 2)}>
            <Text
              style={[
                styles.typeBtnText,
                stationType === 2 && styles.typeBtnTextActive,
              ]}>
              Investigation Center (IC)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <Text style={styles.inputLabel}>Station Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Asansol South"
          placeholderTextColor="#999"
          value={policeStation}
          onChangeText={v => setField('policeStation', v)}
        />

        <Text style={styles.inputLabel}>In-Charge Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Officer In-Charge Name"
          placeholderTextColor="#999"
          value={incharge}
          onChangeText={v => setField('incharge', v)}
        />

        <Text style={styles.inputLabel}>Registered Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={mobile}
          onChangeText={v => setField('mobile', v)}
        />

        <Text style={styles.inputLabel}>Alternative Contact / WhatsApp</Text>
        <TextInput
          style={styles.input}
          placeholder="Alternative Number"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={alternativeMobile}
          onChangeText={v => setField('alternativeMobile', v)}
        />

        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="police_station@gov.in"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={v => setField('email', v)}
        />

        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={v => setField('password', v)}
        />

        <Text style={styles.inputLabel}>Area / Locality</Text>
        <TextInput
          style={styles.input}
          placeholder="Area description"
          placeholderTextColor="#999"
          value={area}
          onChangeText={v => setField('area', v)}
        />

        <Text style={styles.inputLabel}>Pincode</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 713301"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={pin}
          onChangeText={v => setField('pin', v)}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && {opacity: 0.6}]}
          disabled={submitting}
          onPress={handleSubmit}>
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Register Station</Text>
          )}
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
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.themeColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    marginTop: 10,
  },
  cityScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.themeColor,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  cityChipSelected: {
    backgroundColor: AppColors.themeColor,
  },
  cityChipText: {
    color: AppColors.themeColor,
    fontSize: 13,
    fontWeight: '600',
  },
  cityChipTextSelected: {
    color: '#FFFFFF',
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 6,
    backgroundColor: '#F9F9F9',
  },
  typeBtnActive: {
    backgroundColor: AppColors.themeColor,
    borderColor: AppColors.themeColor,
  },
  typeBtnText: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#FAFAFA',
  },
  submitBtn: {
    backgroundColor: AppColors.themeColor,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterStationScreen;
