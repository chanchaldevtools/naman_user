import AppStatusBar from '../components/AppStatusBar';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useUserStore} from '../store/userStore';
import UserCard from '../components/UserCard';
import LoadingView from '../components/LoadingView';
import {AppColors} from '../theme/colors';

type TotalUserNavProp = StackNavigationProp<RootStackParamList, 'TotalUser'>;

const TotalUserScreen = () => {
  const navigation = useNavigation<TotalUserNavProp>();
  const {isLoading, userList, getUserList} = useUserStore();

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
        <Text style={styles.appBarTitle}>Active User List</Text>
      </View>

      {isLoading ? (
        <LoadingView text="Loading.." />
      ) : userList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Users</Text>
        </View>
      ) : (
        <FlatList
          data={userList}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => {
            const address = `${item.house_no ?? ''}, ${item.city ?? ''}, Pin - ${
              item.pincode ?? ''
            }, P.S. - ${item.police_station_id ?? ''}, ${item.state ?? ''}, ${
              item.country ?? ''
            }`;
            const fullName = `${item.frist_name ?? ''} ${item.last_name ?? ''}`;

            return (
              <UserCard
                user={item}
                showVisit={true}
                onVisit={() =>
                  navigation.navigate('AddVisit', {
                    userId: String(item.id),
                    name: fullName,
                    age: String(item.age ?? ''),
                    address: address,
                  })
                }
                onImagePress={() => {
                  if (item.photo) {
                    navigation.navigate('ImageDetail', {
                      imageUrl: item.photo,
                      title: fullName,
                    });
                  }
                }}
              />
            );
          }}
        />
      )}

      {/* Search FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('SearchUser')}>
        <Text style={styles.fabIcon}>🔍</Text>
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: '#536DFE',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 22,
  },
});

export default TotalUserScreen;
