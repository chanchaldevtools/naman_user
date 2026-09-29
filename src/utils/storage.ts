import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  userId: 'userId',
  authToken: 'auth_token',
  psName: 'ps_name',
  officerName: 'officer_name',
  type: 'type',
  designation: 'designation',
  mobileNumber: 'mobile_number',
  whatsappNumber: 'whatsapp_number',
  inchargeName: 'incharge_name',
  area: 'area',
  city: 'city',
  state: 'state',
  stationType: 'station_type',
  emailId: 'email_id',
  userName: 'user_name',
  pincode: 'pincode',
  fcmToken: 'fcm_token',
  isActive: 'is_active',
  createdAt: 'created_at',
};

export {KEYS};

export const storage = {
  set: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  },
  get: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  },
  erase: async () => {
    await AsyncStorage.clear();
  },
  hasData: async (key: string): Promise<boolean> => {
    const val = await AsyncStorage.getItem(key);
    return val !== null && val !== undefined && val !== '';
  },
  multiSet: async (pairs: {key: string; value: string}[]) => {
    for (const p of pairs) {
      await AsyncStorage.setItem(p.key, p.value);
    }
  },
};
