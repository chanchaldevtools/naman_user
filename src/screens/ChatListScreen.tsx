import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AppStatusBar from '../components/AppStatusBar';
import {RootStackParamList} from '../navigation/AppNavigator';
import {AppColors} from '../theme/colors';
import {useAuthStore} from '../store/authStore';

type ChatListNavProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

// API response type
type ChatItem = {
  other_id: number;
  other_name: string;
  other_photo: string;
  last_message: string;
  last_time: string;
};

// UI type
type ChatUser = {
  id: string;
  name: string;
  profilePic?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

const CHAT_LIST_URL =
  'https://naman.inextwebs.com/public/api/chat_list';

const ChatListScreen = () => {
  const navigation = useNavigation<ChatListNavProp>();
  const {sessionData} = useAuthStore();

  const [chatList, setChatList] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Format "2026-10-02 07:58:41" -> "10:45 AM" / "Yesterday" / date
  const formatTime = (raw: string) => {
    if (!raw) return '';

    // MySQL datetime -> JS Date (replace space with T)
    const date = new Date(raw.replace(' ', 'T'));

    if (isNaN(date.getTime())) return raw;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Today -> show time
      let h = date.getHours();
      const m = date.getMinutes().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    }

    if (diffDays === 1) return 'Yesterday';

    if (diffDays < 7) return `${diffDays} days ago`;

    // Older -> show date
    const d = date.getDate().toString().padStart(2, '0');
    const mo = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${d}/${mo}/${date.getFullYear()}`;
  };

  const getChatList = async () => {
    try {
      setLoading(true);

      const senderId = sessionData.userId;

      if (!senderId) {
        console.log('No sender_id found in sessionData');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('sender_id', String(senderId));

      const res = await fetch(CHAT_LIST_URL, {
        method: 'POST',
        body: formData,
        // ⚠️ Content-Type header manually mat lagao — fetch khud boundary set karega
      });

      const json = await res.json();
      console.log('Chat list response:', json);

      if (json.status && Array.isArray(json.data)) {
        const mapped: ChatUser[] = json.data.map((item: ChatItem) => ({
          id: String(item.other_id),
          name: item.other_name,
          profilePic: item.other_photo,
          lastMessage: item.last_message,
          lastMessageTime: formatTime(item.last_time),
          unreadCount: 0, // API me nahi hai, baad me backend se add karo
        }));

        setChatList(mapped);
      } else {
        setChatList([]);
      }
    } catch (e) {
      console.log('Chat list error:', e);
      setChatList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChatList();
  }, []);

  const renderItem = ({item}: {item: ChatUser}) => (
    <TouchableOpacity
      style={styles.chatRow}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('ChatRoom', {
          userId: item.id,
          userName: item.name,
          profilePic: item.profilePic,
        })
      }>
      {/* Profile Picture */}
      {item.profilePic ? (
        <Image source={{uri: item.profilePic}} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      {/* Name + Last message */}
      <View style={styles.chatMid}>
        <Text style={styles.chatName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.chatMsg} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {/* Time + Unread badge */}
      <View style={styles.chatRight}>
        <Text style={styles.chatTime}>{item.lastMessageTime}</Text>

        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.unreadCount > 99 ? '99+' : item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppStatusBar />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.appBarTitle}>Messages</Text>

        <View style={{width: 36}} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={AppColors.themeColor} />
        </View>
      ) : (
        <FlatList
          data={chatList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <MaterialIcons
                name="chat-bubble-outline"
                size={60}
                color="#CCC"
              />
              <Text style={styles.emptyText}>No messages yet</Text>
            </View>
          }
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F8F9FA'},

  appBar: {
    height: 56,
    backgroundColor: AppColors.themeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    elevation: 4,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEE',
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: AppColors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },

  chatMid: {
    flex: 1,
    marginLeft: 12,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  chatMsg: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },

  chatRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  chatTime: {
    fontSize: 11,
    color: '#999',
  },
  badge: {
    marginTop: 6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: 78,
  },

  emptyBox: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 12,
    color: '#999',
    fontSize: 15,
  },
});