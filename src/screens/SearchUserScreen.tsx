import AppStatusBar from '../components/AppStatusBar';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
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

type SearchNavProp = StackNavigationProp<RootStackParamList, 'SearchUser'>;

const SearchUserScreen = () => {
  const navigation = useNavigation<SearchNavProp>();
  const [query, setQuery] = useState('');
  const {isLoading, searchList, searchUsers} = useUserStore();

  useEffect(() => {
    searchUsers('');
  }, []);

  const handleChange = (text: string) => {
    setQuery(text);
    searchUsers(text);
  };

  const handleClear = () => {
    setQuery('');
    searchUsers('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppStatusBar />

      {/* Top Search Bar */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by user name"
            placeholderTextColor="#888888"
            value={query}
            onChangeText={handleChange}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading ? (
        <LoadingView text="Loading users.." />
      ) : searchList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Results found</Text>
        </View>
      ) : (
        <FlatList
          data={searchList}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchHeader: {
    height: 64,
    backgroundColor: AppColors.themeColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backBtn: {
    paddingRight: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchInputContainer: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#777777',
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

export default SearchUserScreen;
