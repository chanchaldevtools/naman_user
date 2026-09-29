import {create} from 'zustand';
import {registerApi, OfficerList} from '../api/registerApi';
import {storage, KEYS} from '../utils/storage';

interface OfficerState {
  isLoading: boolean;
  officerList: OfficerList[];
  error: string | null;

  // Officer form fields
  officerName: string;
  officerMobile: string;
  officerDesignation: string;
  officerPassword: string;

  getOfficerList: (psName?: string) => Promise<void>;
  registerOfficer: (psName?: string) => Promise<string>;
  setField: (field: string, value: string) => void;
  clearForm: () => void;
}

export const useOfficerStore = create<OfficerState>((set, get) => ({
  isLoading: false,
  officerList: [],
  error: null,
  officerName: '',
  officerMobile: '',
  officerDesignation: '',
  officerPassword: '',

  getOfficerList: async (psName?: string) => {
    set({isLoading: true, error: null});
    try {
      let station = psName;
      if (!station) {
        station = (await storage.get(KEYS.psName)) ?? '';
      }
      const res = await registerApi.fetchOfficerList(station);
      if (res.officer_list) {
        set({officerList: res.officer_list, isLoading: false});
      } else {
        set({isLoading: false});
      }
    } catch (e) {
      set({isLoading: false, error: 'Failed to fetch officers'});
    }
  },

  registerOfficer: async (psName?: string) => {
    const {officerName, officerMobile, officerDesignation, officerPassword} = get();
    try {
      let station = psName;
      if (!station) {
        station = (await storage.get(KEYS.psName)) ?? '';
      }
      const res = await registerApi.registerOfficer(
        officerName,
        officerMobile,
        officerDesignation,
        officerPassword,
        station,
      );
      if (res.response === 'ok') {
        if (res.officer_list) {
          set({officerList: res.officer_list});
        }
        set({officerName: '', officerMobile: '', officerDesignation: '', officerPassword: ''});
        return 'ok';
      }
      return res.response ?? 'error';
    } catch (e) {
      return 'error';
    }
  },

  setField: (field: string, value: string) => set({[field]: value} as any),
  clearForm: () =>
    set({
      officerName: '',
      officerMobile: '',
      officerDesignation: '',
      officerPassword: '',
    }),
}));
