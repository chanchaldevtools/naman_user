import AppStatusBar from '../components/AppStatusBar';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useUserRegistrationStore} from '../store/userRegistrationStore';
import {useRegisterStore} from '../store/registerStore';
import {AppColors} from '../theme/colors';

type RegDetailsNavProp = StackNavigationProp<
  RootStackParamList,
  'RegisterUserDetails'
>;

const GENDERS = ['Male', 'Female', 'Others'];
const BLOOD_GROUPS = ['A +', 'A -', 'B +', 'B -', 'O +', 'O -', 'AB +', 'AB -'];

const RegisterUserDetailsScreen = () => {
  const navigation = useNavigation<RegDetailsNavProp>();
  const {
    firstName,
    lastName,
    mobile,
    password,
    gender,
    bloodGroup,
    age,
    havingDiseases,
    diseaseDescription,
    havingMediclaim,
    isHandicapped,
    maritalStatus,
    hasSon,
    hasDaughter,
    hasSonInLaw,
    hasDaughterInLaw,
    houseNo,
    city,
    pincode,
    selectedCity,
    setField,
    submitRegistration,
    resetForm,
  } = useUserRegistrationStore();

  const {cityList, getCityList} = useRegisterStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCityList();
  }, []);

  const handleSubmit = async () => {
    if (!mobile.trim() || mobile.length !== 10) {
      Alert.alert('Required', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Required', 'Please enter a password.');
      return;
    }
    if (!firstName.trim()) {
      Alert.alert('Required', 'Please enter first name.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Required', 'Please enter last name.');
      return;
    }
    if (!age.trim()) {
      Alert.alert('Required', 'Please enter age.');
      return;
    }
    if (!houseNo.trim()) {
      Alert.alert('Required', 'Please enter house/flat number.');
      return;
    }
    if (!pincode.trim()) {
      Alert.alert('Required', 'Please enter pincode.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitRegistration();
      setSubmitting(false);
      if (res === 'ok') {
        Alert.alert('Success', 'Senior citizen user registered successfully!', [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              navigation.navigate('Home');
            },
          },
        ]);
      } else if (res === 'exist') {
        Alert.alert(
          'Already Exists',
          'This phone number already exists, please try with a different number.',
        );
      } else {
        Alert.alert('Notice', res);
      }
    } catch (e) {
      setSubmitting(false);
      Alert.alert('Error', 'Failed to register user.');
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
        <Text style={styles.appBarTitle}>Add user details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>ENTER USER DETAILS</Text>

        {/* Basic Info */}
        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="10-digit Mobile Number"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={10}
          value={mobile}
          onChangeText={v => setField('mobile', v)}
        />

        <Text style={styles.label}>Password *</Text>
        <TextInput
          style={styles.input}
          placeholder="User password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={v => setField('password', v)}
        />

        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={v => setField('firstName', v)}
        />

        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={v => setField('lastName', v)}
        />

        {/* Gender Selection */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.chipRow}>
          {GENDERS.map(g => (
            <TouchableOpacity
              key={g}
              style={[
                styles.chip,
                gender === g && styles.chipSelected,
              ]}
              onPress={() => setField('gender', g)}>
              <Text
                style={[
                  styles.chipText,
                  gender === g && styles.chipTextSelected,
                ]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Blood Group Selection */}
        <Text style={styles.label}>Blood Group</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}>
          {BLOOD_GROUPS.map(bg => (
            <TouchableOpacity
              key={bg}
              style={[
                styles.chip,
                bloodGroup === bg && styles.chipSelected,
              ]}
              onPress={() => setField('bloodGroup', bg)}>
              <Text
                style={[
                  styles.chipText,
                  bloodGroup === bg && styles.chipTextSelected,
                ]}>
                {bg}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          placeholder="Age (e.g. 68)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={3}
          value={age}
          onChangeText={v => setField('age', v)}
        />

        {/* Living Arrangement */}
        <Text style={styles.label}>Living Arrangement</Text>
        <View style={styles.radioRow}>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              maritalStatus === 1 && styles.radioBtnActive,
            ]}
            onPress={() => setField('maritalStatus', 1)}>
            <Text
              style={[
                styles.radioBtnText,
                maritalStatus === 1 && styles.radioBtnTextActive,
              ]}>
              Living Alone
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              maritalStatus === 2 && styles.radioBtnActive,
            ]}
            onPress={() => setField('maritalStatus', 2)}>
            <Text
              style={[
                styles.radioBtnText,
                maritalStatus === 2 && styles.radioBtnTextActive,
              ]}>
              Living with Family
            </Text>
          </TouchableOpacity>
        </View>

        {/* Family Members if living with family */}
        {maritalStatus === 2 && (
          <View style={styles.familyBox}>
            <Text style={styles.subLabel}>Family Members living with user:</Text>
            <View style={styles.checkboxGrid}>
              <TouchableOpacity
                style={styles.checkItem}
                onPress={() => setField('hasSon', !hasSon)}>
                <View style={[styles.box, hasSon && styles.boxChecked]}>
                  {hasSon && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Son</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkItem}
                onPress={() => setField('hasDaughter', !hasDaughter)}>
                <View style={[styles.box, hasDaughter && styles.boxChecked]}>
                  {hasDaughter && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Daughter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkItem}
                onPress={() => setField('hasSonInLaw', !hasSonInLaw)}>
                <View style={[styles.box, hasSonInLaw && styles.boxChecked]}>
                  {hasSonInLaw && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Son-in-law</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkItem}
                onPress={() => setField('hasDaughterInLaw', !hasDaughterInLaw)}>
                <View style={[styles.box, hasDaughterInLaw && styles.boxChecked]}>
                  {hasDaughterInLaw && <Text style={styles.check}>✓</Text>}
                </View>
                <Text style={styles.checkLabel}>Daughter-in-law</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Medical & Health Conditions */}
        <Text style={[styles.label, {marginTop: 18}]}>Health & Medical</Text>

        <TouchableOpacity
          style={styles.checkItem}
          onPress={() => setField('havingDiseases', !havingDiseases)}>
          <View style={[styles.box, havingDiseases && styles.boxChecked]}>
            {havingDiseases && <Text style={styles.check}>✓</Text>}
          </View>
          <Text style={styles.checkLabel}>Any Chronic Disease / Illness?</Text>
        </TouchableOpacity>

        {havingDiseases && (
          <TextInput
            style={[styles.input, {marginTop: 6}]}
            placeholder="Describe illness/disease..."
            placeholderTextColor="#999"
            value={diseaseDescription}
            onChangeText={v => setField('diseaseDescription', v)}
          />
        )}

        <TouchableOpacity
          style={[styles.checkItem, {marginTop: 10}]}
          onPress={() => setField('havingMediclaim', !havingMediclaim)}>
          <View style={[styles.box, havingMediclaim && styles.boxChecked]}>
            {havingMediclaim && <Text style={styles.check}>✓</Text>}
          </View>
          <Text style={styles.checkLabel}>Has Mediclaim / Health Insurance?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.checkItem, {marginTop: 10}]}
          onPress={() => setField('isHandicapped', !isHandicapped)}>
          <View style={[styles.box, isHandicapped && styles.boxChecked]}>
            {isHandicapped && <Text style={styles.check}>✓</Text>}
          </View>
          <Text style={styles.checkLabel}>Physically Handicapped / Disabled?</Text>
        </TouchableOpacity>

        {/* Address */}
        <Text style={[styles.label, {marginTop: 18}]}>Address Details</Text>

        <Text style={styles.label}>House / Flat No *</Text>
        <TextInput
          style={styles.input}
          placeholder="House No / Street"
          placeholderTextColor="#999"
          value={houseNo}
          onChangeText={v => setField('houseNo', v)}
        />

        <Text style={styles.label}>City</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}>
          {cityList.map(c => {
            const cityName = c.city_name || c.city || '';
            const isSel = selectedCity === cityName;
            return (
              <TouchableOpacity
                key={c.id ?? cityName}
                style={[styles.chip, isSel && styles.chipSelected]}
                onPress={() => setField('selectedCity', cityName)}>
                <Text
                  style={[styles.chipText, isSel && styles.chipTextSelected]}>
                  {cityName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Pincode *</Text>
        <TextInput
          style={styles.input}
          placeholder="6-digit Pincode"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={6}
          value={pincode}
          onChangeText={v => setField('pincode', v)}
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && {opacity: 0.6}]}
          disabled={submitting}
          onPress={handleSubmit}>
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Register User</Text>
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
    paddingBottom: 50,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.themeColor,
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    marginTop: 10,
  },
  subLabel: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 8,
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
  chipRow: {
    flexDirection: 'row',
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.themeColor,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: AppColors.themeColor,
  },
  chipText: {
    color: AppColors.themeColor,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  radioRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  radioBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 6,
    backgroundColor: '#F9F9F9',
  },
  radioBtnActive: {
    backgroundColor: AppColors.themeColor,
    borderColor: AppColors.themeColor,
  },
  radioBtnText: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '600',
  },
  radioBtnTextActive: {
    color: '#FFFFFF',
  },
  familyBox: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginVertical: 4,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: AppColors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  boxChecked: {
    backgroundColor: AppColors.themeColor,
  },
  check: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  checkLabel: {
    fontSize: 13,
    color: '#333333',
  },
  submitBtn: {
    backgroundColor: AppColors.themeColor,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterUserDetailsScreen;
