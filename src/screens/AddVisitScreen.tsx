import AppStatusBar from '../components/AppStatusBar';
import React, {useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useVisitStore} from '../store/visitStore';
import {AppColors} from '../theme/colors';

type AddVisitRouteProp = RouteProp<RootStackParamList, 'AddVisit'>;

const AddVisitScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AddVisitRouteProp>();
  const {userId, name, age, address} = route.params;

  const [comment, setComment] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {addVisitorReport} = useVisitStore();

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not pick image');
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Required', 'Please enter a visit comment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await addVisitorReport(
        userId,
        comment,
        undefined,
        undefined,
        imageUri ?? undefined,
      );

      setSubmitting(false);
      if (res === 'ok') {
        Alert.alert('Success', 'Visit report added successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Notice', res);
      }
    } catch (e) {
      setSubmitting(false);
      Alert.alert('Error', 'Failed to submit visit report.');
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
        <Text style={styles.appBarTitle}>Add Visiting Report</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Add Visit of</Text>
        <Text style={styles.infoText}>Name : {name}</Text>
        <Text style={styles.infoText}>Age : {age}</Text>
        {address ? (
          <Text style={styles.addressText}>Address : {address}</Text>
        ) : null}

        <View style={styles.divider} />

        {/* Comment Input */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Enter Comment</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Enter Comment"
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
          />
        </View>

        {/* Image Picker */}
        <TouchableOpacity
          style={styles.imagePickerCard}
          onPress={handlePickImage}>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{uri: imageUri}} style={styles.previewImage} />
              <Text style={styles.changeImageText}>Tap to change image</Text>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.addIcon}>📷</Text>
              <Text style={styles.pickerText}>
                Click here to the visit screenshot
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && {opacity: 0.6}]}
          disabled={submitting}
          onPress={handleSubmit}>
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>Submit</Text>
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
    alignItems: 'center',
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    marginVertical: 2,
  },
  addressText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 10,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#DDDDDD',
    marginVertical: 14,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#000',
    minHeight: 90,
    textAlignVertical: 'top',
  },
  imagePickerCard: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholderContainer: {
    backgroundColor: AppColors.themeColor,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  addIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  pickerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    padding: 8,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  changeImageText: {
    fontSize: 12,
    color: '#536DFE',
    marginTop: 6,
  },
  submitBtn: {
    backgroundColor: AppColors.themeColor,
    width: '100%',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddVisitScreen;
