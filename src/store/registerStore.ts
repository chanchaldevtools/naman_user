import {create} from 'zustand';
import {registerApi, CityItem} from '../api/registerApi';

interface RegisterStoreState {
  isLoading: boolean;
  cityList: CityItem[];
  selectedCity: string;
  stationType: number; // 1=PS, 2=IC
  mobile: string;
  alternativeMobile: string;
  email: string;
  password: string;
  policeStation: string;
  incharge: string;
  area: string;
  pin: string;
  error: string | null;

  getCityList: () => Promise<void>;
  registerStation: () => Promise<string>;
  setField: (field: string, value: any) => void;
}

export const useRegisterStore = create<RegisterStoreState>((set, get) => ({
  isLoading: false,
  cityList: [],
  selectedCity: '',
  stationType: 1,
  mobile: '',
  alternativeMobile: '',
  email: '',
  password: '',
  policeStation: '',
  incharge: '',
  area: '',
  pin: '',
  error: null,

  getCityList: async () => {
    set({isLoading: true});
    try {
      const res = await registerApi.fetchCityList();
      set({cityList: res.city_list ?? [], isLoading: false});
    } catch {
      set({isLoading: false, cityList: []});
    }
  },

  registerStation: async () => {
    const s = get();
    try {
      const stationTypeStr = s.stationType === 1 ? '1' : '2';
      const stationName = `${s.policeStation} ${s.selectedCity}`;
      const res = await registerApi.registerStation(
        s.mobile,
        s.password,
        s.incharge,
        stationTypeStr,
        s.alternativeMobile,
        s.selectedCity,
        'West Bengal',
        'India',
        s.pin,
        s.area,
        stationName,
        s.email,
      );
      return res.response ?? 'error';
    } catch {
      return 'error';
    }
  },

  setField: (field, value) => set({[field]: value} as any),
}));
