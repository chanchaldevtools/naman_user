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
import {useVisitStore} from '../store/visitStore';
import VisitCard from '../components/VisitCard';
import LoadingView from '../components/LoadingView';
import {AppColors} from '../theme/colors';

type VisitNavProp = StackNavigationProp<RootStackParamList, 'Visit'>;

const VisitScreen = () => {
  const navigation = useNavigation<VisitNavProp>();
  const {isLoading, visitList, getAllVisitList} = useVisitStore();

  useEffect(() => {
    getAllVisitList();
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
        <Text style={styles.appBarTitle}>Visit Records</Text>
      </View>

      {isLoading ? (
        <LoadingView text="Loading.." />
      ) : visitList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No visit available</Text>
        </View>
      ) : (
        <FlatList
          data={visitList}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <VisitCard
              item={item}
              onImagePress={() => {
                if (item.photo) {
                  navigation.navigate('ImageDetail', {
                    imageUrl: item.photo,
                    title: `${item.frist_name ?? ''} ${item.last_name ?? ''}`,
                  });
                }
              }}
              onVisitImagePress={() => {
                if (item.image) {
                  navigation.navigate('ImageDetail', {
                    imageUrl: item.image,
                    title: `Visit - ${item.frist_name ?? ''} ${item.last_name ?? ''}`,
                  });
                }
              }}
            />
          )}
        />
      )}

      {/* FAB: + New Visit */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('SearchUser')}>
        <Text style={styles.fabText}>+ New Visit</Text>
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
    bottom: 64,
    backgroundColor: '#536DFE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});

export default VisitScreen;
