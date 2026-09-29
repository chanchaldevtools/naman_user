import AppStatusBar from '../components/AppStatusBar';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {RootStackParamList} from '../navigation/AppNavigator';
import {useAuthStore} from '../store/authStore';
import {AppColors} from '../theme/colors';

type LoginNavProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginNavProp>();

  const {loginPS, loginOfficer, isLoading} = useAuthStore();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<1 | 2>(1);

  // =========================
  // Validation
  // =========================
  const validate = () => {
    if (!mobile.trim()) {
      Alert.alert(
        'Validation',
        'Please enter your mobile number',
      );
      return false;
    }

    if (mobile.length !== 10) {
      Alert.alert(
        'Validation',
        'Mobile number should be 10 digits',
      );
      return false;
    }

    if (!password.trim()) {
      Alert.alert(
        'Validation',
        'Please enter your password',
      );
      return false;
    }

    return true;
  };

  // =========================
  // Login
  // =========================
  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    let result: string;

    if (loginType === 1) {
      console.log('Login Mobile:', mobile);

      result = await loginPS(
        mobile,
        password,
      );
    } else {
      console.log('Officer Login Mobile:', mobile);

      result = await loginOfficer(
        mobile,
        password,
      );
    }

    if (result === 'ok') {
      navigation.replace('Home');
    } else if (result === 'not_approved') {
      Alert.alert(
        'Not Approved',
        'Your account is not approved yet.',
      );
    } else {
      Alert.alert(
        'Login Failed',
        'Invalid credentials. Please try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }>

      <AppStatusBar />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* =========================
            Top Decoration
        ========================== */}
        <Image
          source={require('../../assets/images/blutop.png')}
          style={styles.topDecor}
          resizeMode="stretch"
        />

        {/* =========================
            Logo Area
        ========================== */}
        <View style={styles.logoArea}>

          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {/* =========================
            Login Card
        ========================== */}
        <View style={styles.card}>

          <Text style={styles.loginTitle}>
            SIGN IN
          </Text>

          {/* =========================
              Login Type
          ========================== */}
          <View style={styles.radioRow}>

            {/* PS / IC */}
            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => setLoginType(1)}
              activeOpacity={0.7}>

              <View style={styles.radioOuter}>
                {loginType === 1 && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Text style={styles.radioLabel}>
                PS/IC Login
              </Text>

            </TouchableOpacity>

            {/* Officer */}
            <TouchableOpacity
              style={styles.radioItem}
              onPress={() => setLoginType(2)}
              activeOpacity={0.7}>

              <View style={styles.radioOuter}>
                {loginType === 2 && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <Text style={styles.radioLabel}>
                Officer Login
              </Text>

            </TouchableOpacity>

          </View>

          {/* =========================
              Mobile Number
          ========================== */}
          <View style={styles.inputWrapper}>

            <Text style={styles.label}>
              Mobile Number
            </Text>

            <View style={styles.inputIconWrapper}>

              <MaterialIcons
                name="phone"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.iconInput}
                value={mobile}
                onChangeText={text => {
                  setMobile(
                    text.replace(/[^0-9]/g, ''),
                  );
                }}
                placeholder="Enter Mobile Number"
                placeholderTextColor="#bbb"
                keyboardType="number-pad"
                maxLength={10}
              />

            </View>

          </View>

          {/* =========================
              Password
          ========================== */}
          <View style={styles.inputWrapper}>

            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.passwordRow}>

              <View
                style={[
                  styles.inputIconWrapper,
                  styles.passwordInputWrapper,
                ]}>

                <MaterialIcons
                  name="lock"
                  size={20}
                  color="#777"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.iconInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter Password"
                  placeholderTextColor="#bbb"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Password Visibility */}
                <TouchableOpacity
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                  style={styles.eyeBtn}
                  activeOpacity={0.7}>

                  <MaterialIcons
                    name={
                      showPassword
                        ? 'visibility-off'
                        : 'visibility'
                    }
                    size={22}
                    color="#777"
                  />

                </TouchableOpacity>

              </View>

            </View>

          </View>

          {/* =========================
              Login Button
          ========================== */}
          <TouchableOpacity
            style={[
              styles.loginBtn,
              isLoading && styles.loginBtnDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}>

            {isLoading ? (
              <ActivityIndicator
                color="#FFFFFF"
                size="small"
              />
            ) : (
              <View style={styles.loginButtonContent}>

                <MaterialIcons
                  name="login"
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={styles.loginBtnText}>
                  LOGIN
                </Text>

              </View>
            )}

          </TouchableOpacity>

          {/* =========================
              Register
          ========================== */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'RegisterStation',
              )
            }
            style={styles.registerLink}
            activeOpacity={0.7}>

            <Text style={styles.registerText}>
              Don't have account?{' '}

              <Text
                style={styles.registerHighlight}>
                Register
              </Text>
            </Text>

          </TouchableOpacity>

        </View>

        {/* =========================
            Bottom Decoration
        ========================== */}
        <Image
          source={require('../../assets/images/bluedwn.png')}
          style={styles.bottomDecor}
          resizeMode="stretch"
        />

      </ScrollView>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

  // =========================
  // Main
  // =========================
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scroll: {
    flexGrow: 1,
  },

  // =========================
  // Top Decoration
  // =========================
  topDecor: {
    width: '100%',
    height: 130,
  },

  // =========================
  // Logo
  // =========================
  logoArea: {
    alignItems: 'center',
    paddingVertical: 10,
  },

  icon: {
    width: 300,
    height: 100,
    marginTop: 4,
  },

  appName: {
    fontSize: 26,
    fontWeight: '900',
    color: AppColors.themeColor,
    letterSpacing: 3,
  },

  subtitle: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 6,
  },

  // =========================
  // Card
  // =========================
  card: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,

    elevation: 6,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    marginBottom: 20,
  },

  loginTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.themeColor,
    marginBottom: 16,
  },

  // =========================
  // Radio
  // =========================
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 30,
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: AppColors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: AppColors.themeColor,
  },

  radioLabel: {
    fontSize: 13,
    color: '#333333',
  },

  // =========================
  // Input
  // =========================
  inputWrapper: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 4,
    fontWeight: '600',
  },

  inputIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,

    backgroundColor: '#FAFAFA',

    minHeight: 46,
  },

  inputIcon: {
    marginLeft: 12,
    marginRight: 7,
  },

  iconInput: {
    flex: 1,

    paddingHorizontal: 4,
    paddingVertical: 10,

    fontSize: 14,
    color: '#333333',

    backgroundColor: 'transparent',
  },

  // =========================
  // Password
  // =========================
  passwordRow: {
    width: '100%',
  },

  passwordInputWrapper: {
    width: '100%',
  },

  eyeBtn: {
    width: 45,
    height: 45,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 2,
  },

  // =========================
  // Login Button
  // =========================
  loginBtn: {
    backgroundColor: AppColors.themeColor,

    borderRadius: 8,

    paddingVertical: 14,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 6,

    minHeight: 50,
  },

  loginBtnDisabled: {
    opacity: 0.7,
  },

  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 8,
  },

  // =========================
  // Register
  // =========================
  registerLink: {
    marginTop: 14,
    alignItems: 'center',
  },

  registerText: {
    fontSize: 13,
    color: '#555555',
  },

  registerHighlight: {
    color: AppColors.themeColorTwo,
    fontWeight: '700',
  },

  // =========================
  // Bottom Decoration
  // =========================
  bottomDecor: {
    width: '100%',
    height: 120,
    marginTop: 'auto',
  },
});

export default LoginScreen;