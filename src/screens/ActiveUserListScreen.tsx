import AppStatusBar from '../components/AppStatusBar';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useUserStore} from '../store/userStore';
import UserCard from '../components/UserCard';
import LoadingView from '../components/LoadingView';
import {AppColors} from '../theme/colors';

type ActiveUserNavProp = StackNavigationProp<RootStackParamList, 'ActiveUserList'>;

const ActiveUserListScreen = () => {
  const navigation = useNavigation<ActiveUserNavProp>();
  const {isLoading, acceptedList, getUserList} = useUserStore();

  useEffect(() => {
    getUserList();
  }, []);

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
        <Text style={styles.appBarTitle}>Active User List..</Text>
      </View>

      {isLoading ? (
        <LoadingView text="Loading.." />
      ) : acceptedList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No User Request</Text>
        </View>
      ) : (
        <FlatList
          data={acceptedList}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <UserCard
              user={item}
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
});

export default ActiveUserListScreen;
