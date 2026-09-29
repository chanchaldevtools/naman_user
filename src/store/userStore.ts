import {create} from 'zustand';
import {userApi, UserListData} from '../api/userApi';
import {storage, KEYS} from '../utils/storage';

interface UserState {
  isLoading: boolean;
  userList: UserListData[];
  newUserRequestList: UserListData[];
  acceptedList: UserListData[];
  rejectedList: UserListData[];
  searchList: UserListData[];
  error: string | null;

  getUserList: (psName?: string) => Promise<void>;
  acceptRejectUser: (userId: string, action: string) => Promise<boolean>;
  searchUsers: (key: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  isLoading: false,
  userList: [],
  newUserRequestList: [],
  acceptedList: [],
  rejectedList: [],
  searchList: [],
  error: null,

  getUserList: async (psName?: string) => {
    set({isLoading: true, error: null});
    try {
      let station = psName;
      if (!station) {
        station = (await storage.get(KEYS.psName)) ?? '';
      }
      const res = await userApi.fetchUserList(station);
      if (res.userData) {
        const all = res.userData;
        const pending = all.filter(u => String(u.is_accept) === '0');
        const accepted = all.filter(u => String(u.is_accept) === '1');
        const rejected = all.filter(u => String(u.is_accept) === '2');
        set({
          userList: all,
          newUserRequestList: pending,
          acceptedList: accepted,
          rejectedList: rejected,
          isLoading: false,
        });
      } else {
        set({isLoading: false});
      }
    } catch (e) {
      set({isLoading: false, error: 'Failed to fetch users'});
    }
  },

  acceptRejectUser: async (userId: string, action: string) => {
    try {
      const res = await userApi.acceptReject(userId, action);
      if (res.response === 'ok') {
        await get().getUserList();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  searchUsers: async (key: string) => {
    set({isLoading: true, error: null});
    try {
      const res = await userApi.searchUsers(key);
      set({searchList: res.userData ?? [], isLoading: false});
    } catch (e) {
      set({searchList: [], isLoading: false, error: 'Failed to search users'});
    }
  },
}));
