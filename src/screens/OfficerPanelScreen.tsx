import AppStatusBar from '../components/AppStatusBar';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useOfficerStore} from '../store/officerStore';
import LoadingView from '../components/LoadingView';
import {AppColors} from '../theme/colors';

type OfficerNavProp = StackNavigationProp<RootStackParamList, 'OfficerPanel'>;

const OfficerPanelScreen = () => {
  const navigation = useNavigation<OfficerNavProp>();
  const {
    isLoading,
    officerList,
    getOfficerList,
    registerOfficer,
    officerName,
    officerMobile,
    officerDesignation,
    officerPassword,
    setField,
    clearForm,
  } = useOfficerStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getOfficerList();
  }, []);

  const handleRegister = async () => {
    if (!officerMobile.trim()) {
      Alert.alert('Required', 'Please enter registered mobile number.');
      return;
    }
    if (!officerName.trim()) {
      Alert.alert('Required', 'Please enter officer name.');
      return;
    }
    if (!officerDesignation.trim()) {
      Alert.alert('Required', 'Please enter designation.');
      return;
    }
    if (!officerPassword.trim()) {
      Alert.alert('Required', 'Please enter password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerOfficer();
      setSubmitting(false);
      if (res === 'ok') {
        setModalVisible(false);
        clearForm();
        Alert.alert('Success', 'Officer registered successfully!');
      } else {
        Alert.alert('Notice', res);
      }
    } catch (e) {
      setSubmitting(false);
      Alert.alert('Error', 'Failed to register officer.');
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
        <Text style={styles.appBarTitle}>OFFICER PANNEL</Text>
      </View>

      {isLoading ? (
        <LoadingView text="Loading.." />
      ) : officerList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Officer Registered</Text>
        </View>
      ) : (
        <FlatList
          data={officerList}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <View style={styles.officerCard}>
              <Text style={styles.officerTitle}>{item.officer_name}</Text>
              <Text style={styles.officerDetail}>Mobile : {item.mobile_number}</Text>
              <View style={styles.cardDivider} />
              <Text style={styles.officerDetail}>Station : {item.police_station_name}</Text>
              <Text style={styles.officerDetail}>Designation : {item.designation}</Text>
              <Text style={styles.officerDetail}>Username : {item.user_name}</Text>
              {item.created_at ? (
                <Text style={styles.officerDate}>{item.created_at}</Text>
              ) : null}
            </View>
          )}
        />
      )}

      {/* Add Officer FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          clearForm();
          setModalVisible(true);
        }}>
        <Text style={styles.fabText}>+ Add Officer</Text>
      </TouchableOpacity>

      {/* Add Officer Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalHeader}>Enter Officer Details</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter Mobile"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={officerMobile}
                onChangeText={v => setField('officerMobile', v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter officer name"
                placeholderTextColor="#999"
                value={officerName}
                onChangeText={v => setField('officerName', v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter Designation"
                placeholderTextColor="#999"
                value={officerDesignation}
                onChangeText={v => setField('officerDesignation', v)}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#999"
                secureTextEntry
                value={officerPassword}
                onChangeText={v => setField('officerPassword', v)}
              />

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelModalBtn]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.submitModalBtn]}
                  disabled={submitting}
                  onPress={handleRegister}>
                  {submitting ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={styles.submitBtnText}>Register Officer</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  listContent: {
    padding: 10,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
  },
  officerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginVertical: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  officerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  officerDetail: {
    fontSize: 13,
    color: '#333333',
    marginVertical: 1,
  },
  cardDivider: {
    height: 0.5,
    backgroundColor: '#CCCCCC',
    marginVertical: 6,
  },
  officerDate: {
    fontSize: 11,
    color: '#777777',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 64,
    backgroundColor: AppColors.themeColorTwo,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.themeColorLight,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
    marginBottom: 12,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelModalBtn: {
    backgroundColor: '#EEEEEE',
    marginRight: 10,
  },
  cancelBtnText: {
    color: '#555555',
    fontWeight: '600',
  },
  submitModalBtn: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default OfficerPanelScreen;
