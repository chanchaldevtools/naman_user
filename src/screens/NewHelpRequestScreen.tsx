import AppStatusBar from '../components/AppStatusBar';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useHelpStore} from '../store/helpStore';
import {useAuthStore} from '../store/authStore';
import HelpCard from '../components/HelpCard';
import LoadingView from '../components/LoadingView';
import {AppColors} from '../theme/colors';

type NewHelpNavProp = StackNavigationProp<RootStackParamList, 'NewHelpRequest'>;

const NewHelpRequestScreen = () => {
  const navigation = useNavigation<NewHelpNavProp>();
  const {isLoading, newHelpList, getHelpList, helpAcceptRejected} =
    useHelpStore();
  const sessionData = useAuthStore(s => s.sessionData);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'reject' | 'com'>('com');
  const [selectedHelpId, setSelectedHelpId] = useState<string>('');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    getHelpList();
  }, []);

  const handleAccept = async (id?: number) => {
    if (!id) return;
    try {
      const res = await helpAcceptRejected('1', String(id));
      if (res === 'ok') {
        Alert.alert('Accepted', 'Help request accepted successfully.');
      } else {
        Alert.alert('Notice', res);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to accept help request.');
    }
  };

  const openNoteModal = (type: 'reject' | 'com', id?: number) => {
    if (!id) return;
    setSelectedHelpId(String(id));
    setModalType(type);
    setNoteText('');
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    if (!noteText.trim()) {
      Alert.alert('Required', 'Please enter a note / comment.');
      return;
    }

    const actionType = modalType === 'reject' ? '2' : '3';
    try {
      const res = await helpAcceptRejected(actionType, selectedHelpId, noteText);
      setModalVisible(false);
      if (res === 'ok') {
        Alert.alert(
          'Success',
          modalType === 'reject'
            ? 'Help request rejected successfully.'
            : 'Help request marked as completed.',
        );
      } else {
        Alert.alert('Notice', res);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update request.');
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
        <Text style={styles.appBarTitle}>New Help Requests</Text>
      </View>

      {isLoading ? (
        <LoadingView text="Loading.." />
      ) : newHelpList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Help Request</Text>
        </View>
      ) : (
        <FlatList
          data={newHelpList}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <HelpCard
              item={item}
              officerName={sessionData.officerName ?? ''}
              showActions={true}
              onAccept={() => handleAccept(item.id)}
              onReject={() => openNoteModal('reject', item.id)}
              onComplete={() => openNoteModal('com', item.id)}
              onImagePress={() => {
                if (item.photo) {
                  navigation.navigate('ImageDetail', {
                    imageUrl: item.photo,
                    title: `${item.frist_name ?? ''} ${item.last_name ?? ''}`,
                  });
                }
              }}
            />
          )}
        />
      )}

      {/* Comment / Note Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {modalType === 'reject' ? 'Reject Reason' : 'Completed Note'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter note / comment..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={3}
              value={noteText}
              onChangeText={setNoteText}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.submitBtn]}
                onPress={handleModalSubmit}>
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
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
    padding: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#000',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelBtn: {
    backgroundColor: '#EEEEEE',
  },
  cancelBtnText: {
    color: '#333333',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: AppColors.themeColor,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default NewHelpRequestScreen;
