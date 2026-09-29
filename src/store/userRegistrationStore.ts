import {create} from 'zustand';
import {registerUserApi} from '../api/registerUserApi';
import {storage, KEYS} from '../utils/storage';

interface UserRegistrationState {
  // Step 1
  imageUri: string;
  hasCo: boolean;
  coName: string;
  coMobile: string;

  // Step 2
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  age: string;
  havingDiseases: boolean;
  diseaseDescription: string;
  havingMediclaim: boolean;
  isHandicapped: boolean;
  maritalStatus: number; // 1 = Alone, 2 = With Family
  hasSon: boolean;
  hasDaughter: boolean;
  hasSonInLaw: boolean;
  hasDaughterInLaw: boolean;
  hasOtherMember: boolean;
  houseNo: string;
  city: string;
  pincode: string;
  selectedCity: string;

  setField: (field: string, value: any) => void;
  submitRegistration: () => Promise<string>;
  resetForm: () => void;
}

export const useUserRegistrationStore = create<UserRegistrationState>(
  (set, get) => ({
    imageUri: '',
    hasCo: false,
    coName: '',
    coMobile: '',

    firstName: '',
    lastName: '',
    mobile: '',
    password: '',
    gender: 'Male',
    bloodGroup: 'A +',
    dob: 'Select DOB',
    age: '',
    havingDiseases: false,
    diseaseDescription: '',
    havingMediclaim: false,
    isHandicapped: false,
    maritalStatus: 1,
    hasSon: false,
    hasDaughter: false,
    hasSonInLaw: false,
    hasDaughterInLaw: false,
    hasOtherMember: false,
    houseNo: '',
    city: '',
    pincode: '',
    selectedCity: '',

    setField: (field, value) => set({[field]: value} as any),

    resetForm: () =>
      set({
        imageUri: '',
        hasCo: false,
        coName: '',
        coMobile: '',
        firstName: '',
        lastName: '',
        mobile: '',
        password: '',
        gender: 'Male',
        bloodGroup: 'A +',
        dob: 'Select DOB',
        age: '',
        havingDiseases: false,
        diseaseDescription: '',
        havingMediclaim: false,
        isHandicapped: false,
        maritalStatus: 1,
        hasSon: false,
        hasDaughter: false,
        hasSonInLaw: false,
        hasDaughterInLaw: false,
        hasOtherMember: false,
        houseNo: '',
        city: '',
        pincode: '',
        selectedCity: '',
      }),

    submitRegistration: async () => {
      const s = get();
      const psName = (await storage.get(KEYS.psName)) ?? '';

      const formData = new FormData();
      formData.append('mobile_number', s.mobile);
      formData.append('password', s.password);
      formData.append('frist_name', s.firstName);
      formData.append('last_name', s.lastName);
      formData.append('gender', s.gender);
      formData.append('blood_group', s.bloodGroup);
      formData.append('dob', s.dob);
      formData.append('age', s.age);
      formData.append('any_disablity', s.havingDiseases ? 'true' : 'false');
      formData.append('desis_desc', s.diseaseDescription);
      formData.append('has_mediclaim', s.havingMediclaim ? 'true' : 'false');
      formData.append('house_no', s.houseNo);
      formData.append('city', s.selectedCity || s.city);
      formData.append('pincode', s.pincode);
      formData.append('police_station_id', psName);
      formData.append('country', 'India');
      formData.append('co_contact_number', s.coMobile);
      formData.append('co_name', s.coName);
      formData.append('has_co', s.hasCo ? 'true' : 'false');
      formData.append('is_handicaped', s.isHandicapped ? 'true' : 'false');
      formData.append('state', 'West Bengal');
      formData.append('maritual_status', String(s.maritalStatus));
      formData.append('has_son', s.hasSon ? 'true' : 'false');
      formData.append('has_daughter', s.hasDaughter ? 'true' : 'false');
      formData.append('has_son_law', s.hasSonInLaw ? 'true' : 'false');
      formData.append('has_daughter_law', s.hasDaughterInLaw ? 'true' : 'false');
      formData.append('fcm', '');

      if (s.imageUri) {
        const filename = s.imageUri.split('/').pop() || 'photo.jpg';
        formData.append('image', {
          uri: s.imageUri,
          type: 'image/jpeg',
          name: filename,
        } as any);
      }

      try {
        const res = await registerUserApi.registerUser(formData);
        return res.response ?? 'error';
      } catch (e) {
        return 'error';
      }
    },
  }),
);
