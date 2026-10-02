import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AppStatusBar from '../components/AppStatusBar';
import {RootStackParamList} from '../navigation/AppNavigator';
import {AppColors} from '../theme/colors';
import {useAuthStore} from '../store/authStore';
import {onNewMessage} from '../utils/notificationService'; // ✅ add

type ChatRoomRoute = RouteProp<RootStackParamList, 'ChatRoom'>;

type ApiMessage = {
  id: number;
  sender_id: number;
  reciver_id: number;
  msg: string;
  sender_type: string;
  reciver_type: string;
  created_at: string;
  updated_at: string;
};

type Message = {
  id: string;
  text: string;
  mine: boolean;
  time: string;
};

const GET_MESSAGES_URL = 'https://naman.inextwebs.com/public/api/get_messages';
const SEND_MESSAGE_URL = 'https://naman.inextwebs.com/public/api/send-message-id';

const ChatRoomScreen = () => {
  const route = useRoute<ChatRoomRoute>();
  const navigation = useNavigation();
  const {userName, userId} = route.params;

  const {sessionData, userType} = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const formatTime = (raw: string) => {
    if (!raw) return '';
    const date = new Date(raw.replace(' ', 'T'));
    if (isNaN(date.getTime())) return '';

    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const getSenderType = () => (userType === 'of' ? 'police' : 'consumer');
  const getRecType = () => (userType === 'of' ? 'consumer' : 'police');

  const getMessages = async () => {
    try {
      setLoading(true);

      const senderId = sessionData.userId;
      if (!senderId) return;

      const formData = new FormData();
      formData.append('sender_id', String(senderId));
      formData.append('reciver_id', String(userId));

      const res = await fetch(GET_MESSAGES_URL, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      console.log('Get messages:', json);

      if (json.status && Array.isArray(json.data)) {
        const mapped: Message[] = json.data.map((m: ApiMessage) => ({
          id: String(m.id),
          text: m.msg,
          mine: String(m.sender_id) === String(senderId),
          time: formatTime(m.created_at),
        }));

        setMessages(mapped);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({animated: false});
        }, 100);
      } else {
        setMessages([]);
      }
    } catch (e) {
      console.log('Get messages error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  // ✅ Push notification se aaya message append karo
  useEffect(() => {
    const unsubscribe = onNewMessage((data: any) => {
      console.log('🔔 ChatRoom received push:', data);

      // Sirf usi chat ka message append karo jiska sender_id is chat ka userId hai
      const incomingSenderId = String(data.sender_id || '');
      const currentChatUserId = String(userId || '');

      if (incomingSenderId !== currentChatUserId) {
        console.log('⏭️ Skipping — not for this chat');
        return;
      }

      // Same message already exists? (duplicate check)
      const incomingMsgId = String(data.message_id || '');
      if (incomingMsgId) {
        setMessages(prev => {
          if (prev.some(m => m.id === incomingMsgId)) {
            console.log('⏭️ Duplicate — skipping');
            return prev;
          }

          const newMsg: Message = {
            id: incomingMsgId,
            text: data.message || '',
            mine: false, // push aaya matlab doosre ne bheja
            time: formatTime(data.created_at || ''),
          };

          setTimeout(() => {
            flatListRef.current?.scrollToEnd({animated: true});
          }, 50);

          return [...prev, newMsg];
        });
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const senderId = sessionData.userId;
    if (!senderId) return;

    const tempId = `temp-${Date.now()}`;
    const tempMsg: Message = {
      id: tempId,
      text,
      mine: true,
      time: formatTime(new Date().toISOString()),
    };

    setMessages(prev => [...prev, tempMsg]);
    setInput('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 50);

    try {
      setSending(true);

      const formData = new FormData();
      formData.append('sender_id', String(senderId));
      formData.append('reciver_id', String(userId));
      formData.append('msg', text);
      formData.append('sender_type', 'police');
      formData.append('rec_type', 'consumer');

      const res = await fetch(SEND_MESSAGE_URL, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      console.log('Send message:', json);

      if (json?.status && json?.data?.id) {
        setMessages(prev =>
          prev.map(m =>
            m.id === tempId
              ? {
                  ...m,
                  id: String(json.data.id),
                  time: formatTime(json.data.created_at),
                }
              : m,
          ),
        );
      }
    } catch (e) {
      console.log('Send message error:', e);
      setMessages(prev =>
        prev.map(m =>
          m.id === tempId ? {...m, text: `${m.text} ⚠️`} : m,
        ),
      );
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({item}: {item: Message}) => (
    <View
      style={[
        styles.msgWrap,
        item.mine ? styles.myWrap : styles.theirWrap,
      ]}>
      <View
        style={[
          styles.msgBubble,
          item.mine ? styles.myBubble : styles.theirBubble,
        ]}>
        <Text style={styles.msgText}>{item.text}</Text>
        <Text style={styles.msgTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppStatusBar />

      <View style={styles.appBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.appBarTitle} numberOfLines={1}>
          {userName}
        </Text>

        <View style={{width: 36}} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={AppColors.themeColor} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={m => m.id}
            contentContainerStyle={styles.listContent}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
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
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({animated: false})
            }
          />
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, sending && {opacity: 0.6}]}
            onPress={sendMessage}
            disabled={sending}>
            <MaterialIcons name="send" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatRoomScreen;

// ... styles same rahenge
const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#ECE5DD'},
  flex1: {flex: 1},

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
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
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

  listContent: {
    padding: 12,
    flexGrow: 1,
  },

  msgWrap: {
    marginVertical: 4,
  },
  myWrap: {
    alignItems: 'flex-end',
  },
  theirWrap: {
    alignItems: 'flex-start',
  },

  msgBubble: {
    maxWidth: '78%',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  myBubble: {backgroundColor: '#DCF8C6'},
  theirBubble: {backgroundColor: '#FFFFFF'},
  msgText: {
    color: '#000',
    fontSize: 15,
  },
  msgTime: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 3,
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#999',
    fontSize: 15,
  },

  inputBar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 42,
    maxHeight: 100,
    color: '#000',
  },
  sendBtn: {
    marginLeft: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
});