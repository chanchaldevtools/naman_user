import {create} from 'zustand';
import {loginApi, LoginUserData, OfficerLoginUserData} from '../api/loginApi';
import {storage, KEYS} from '../utils/storage';

export interface SessionData {
  userId?: string | null;
  psName?: string | null;
  officerName?: string | null;
  inchargeName?: string | null;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  stationType?: string | null;
  mobileNumber?: string | null;
  whatsappNumber?: string | null;
  altNumber?: string | null;
  emailId?: string | null;
  designation?: string | null;
  userName?: string | null;
  pincode?: string | null;
  authToken?: string | null;
}

interface AuthState {
  isLoggedIn: boolean;
  userType: 'ps' | 'officer' | 'of' | null;
  userId: string | null;
  psName: string | null;
  officerName: string | null;
  designation: string | null;
  mobileNumber: string | null;
  whatsappNumber: string | null;
  inchargeName: string | null;
  area: string | null;
  city: string | null;
  state: string | null;
  stationType: string | null;
  emailId: string | null;
  userName: string | null;
  pincode: string | null;
  authToken: string | null;
  isLoading: boolean;
  error: string | null;
  sessionData: SessionData;

  // ✅ yahan fcmToken param add kiya
  loginPS: (
    mobile: string,
    password: string,
    fcmToken?: string,
  ) => Promise<string>;
  loginOfficer: (
    mobile: string,
    password: string,
    fcmToken?: string,
  ) => Promise<string>;
  logout: () => Promise<void>;
  loadSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  userType: null,
  userId: null,
  psName: null,
  officerName: null,
  designation: null,
  mobileNumber: null,
  whatsappNumber: null,
  inchargeName: null,
  area: null,
  city: null,
  state: null,
  stationType: null,
  emailId: null,
  userName: null,
  pincode: null,
  authToken: null,
  isLoading: false,
  error: null,
  sessionData: {},

  // ══════════════════════════════════════════
  // PS / IC LOGIN
  // ══════════════════════════════════════════
  loginPS: async (mobile, password, fcmToken = '') => {
    set({isLoading: true, error: null});
    try {
      console.log('📤 PS Login — fcm:', fcmToken);

      const res = await loginApi.psLogin(
        mobile,
        password,
        '1',
        fcmToken, // ✅ real FCM token bhej rahe hain
      );

      if (res.response === 'ok' && res.userData) {
        const d = res.userData;
        await storage.erase();
        await storage.multiSet([
          {key: KEYS.userId, value: d.id?.toString() ?? ''},
          {key: KEYS.authToken, value: d.auth_token ?? ''},
          {key: KEYS.psName, value: d.police_station_name ?? ''},
          {key: KEYS.officerName, value: d.police_station_name ?? ''},
          {key: KEYS.inchargeName, value: d.incharge_name ?? ''},
          {key: KEYS.area, value: d.area ?? ''},
          {key: KEYS.pincode, value: d.pincode ?? ''},
          {key: KEYS.stationType, value: d.station_type ?? ''},
          {key: KEYS.mobileNumber, value: d.mobile_number ?? ''},
          {key: KEYS.whatsappNumber, value: d.whatsapp_number ?? ''},
          {key: KEYS.city, value: d.city ?? ''},
          {key: KEYS.emailId, value: d.email_id ?? ''},
          {key: KEYS.state, value: d.state ?? ''},
          {key: KEYS.fcmToken, value: fcmToken ?? ''}, // ✅ optional: fcm save bhi kar lo
        ]);

        const session: SessionData = {
          userId: d.id?.toString() ?? null,
          authToken: d.auth_token ?? null,
          psName: d.police_station_name ?? null,
          officerName: d.police_station_name ?? null,
          inchargeName: d.incharge_name ?? null,
          area: d.area ?? null,
          city: d.city ?? null,
          state: d.state ?? null,
          stationType: d.station_type ?? null,
          mobileNumber: d.mobile_number ?? null,
          whatsappNumber: d.whatsapp_number ?? null,
          altNumber: d.whatsapp_number ?? null,
          emailId: d.email_id ?? null,
          pincode: d.pincode ?? null,
        };

        set({
          isLoggedIn: true,
          userType: 'ps',
          ...session,
          sessionData: session,
          isLoading: false,
        });
        return 'ok';
      }
      set({isLoading: false});
      return res.response ?? 'error';
    } catch (e) {
      set({isLoading: false, error: 'Network error'});
      return 'error';
    }
  },

  // ══════════════════════════════════════════
  // OFFICER LOGIN
  // ══════════════════════════════════════════
  loginOfficer: async (mobile, password, fcmToken = '') => {
    set({isLoading: true, error: null});
    try {
      console.log('📤 Officer Login — fcm:', fcmToken);

      const res = await loginApi.officerLogin(
        mobile,
        password,
        '2',
        fcmToken, // ✅ real FCM token bhej rahe hain
      );

      if (res.response === 'ok' && res.userData) {
        const d = res.userData as OfficerLoginUserData;
        await storage.erase();
        await storage.multiSet([
          {key: KEYS.type, value: 'of'},
          {key: KEYS.userId, value: d.id?.toString() ?? ''},
          {key: KEYS.officerName, value: d.officer_name ?? ''},
          {key: KEYS.mobileNumber, value: d.mobile_number ?? ''},
          {key: KEYS.designation, value: d.designation ?? ''},
          {key: KEYS.fcmToken, value: fcmToken ?? ''}, // ✅ fcm save
          {key: KEYS.isActive, value: d.is_active?.toString() ?? ''},
          {key: KEYS.psName, value: d.police_station_name ?? ''},
          {key: KEYS.userName, value: d.user_name ?? ''},
          {key: KEYS.createdAt, value: d.created_at ?? ''},
        ]);

        const session: SessionData = {
          userId: d.id?.toString() ?? null,
          officerName: d.officer_name ?? null,
          mobileNumber: d.mobile_number ?? null,
          designation: d.designation ?? null,
          psName: d.police_station_name ?? null,
          userName: d.user_name ?? null,
        };

        set({
          isLoggedIn: true,
          userType: 'of',
          ...session,
          sessionData: session,
          isLoading: false,
        });
        return 'ok';
      }
      set({isLoading: false});
      return res.response ?? 'error';
    } catch (e) {
      set({isLoading: false, error: 'Network error'});
      return 'error';
    }
  },

  // ══════════════════════════════════════════
  // LOGOUT
  // ══════════════════════════════════════════
  logout: async () => {
    await storage.erase();
    set({
      isLoggedIn: false,
      userType: null,
      userId: null,
      psName: null,
      officerName: null,
      designation: null,
      mobileNumber: null,
      whatsappNumber: null,
      inchargeName: null,
      area: null,
      city: null,
      state: null,
      stationType: null,
      emailId: null,
      userName: null,
      pincode: null,
      authToken: null,
      sessionData: {},
    });
  },

  // ══════════════════════════════════════════
  // LOAD SESSION
  // ══════════════════════════════════════════
  loadSession: async () => {
    const psName = await storage.get(KEYS.psName);
    const type = await storage.get(KEYS.type);
    if (psName) {
      const userId = await storage.get(KEYS.userId);
      const officerName = await storage.get(KEYS.officerName);
      const inchargeName = await storage.get(KEYS.inchargeName);
      const area = await storage.get(KEYS.area);
      const city = await storage.get(KEYS.city);
      const state = await storage.get(KEYS.state);
      const stationType = await storage.get(KEYS.stationType);
      const mobileNumber = await storage.get(KEYS.mobileNumber);
      const whatsappNumber = await storage.get(KEYS.whatsappNumber);
      const emailId = await storage.get(KEYS.emailId);
      const designation = await storage.get(KEYS.designation);
      const userName = await storage.get(KEYS.userName);
      const pincode = await storage.get(KEYS.pincode);

      const session: SessionData = {
        userId,
        psName,
        officerName,
        inchargeName,
        area,
        city,
        state,
        stationType,
        mobileNumber,
        whatsappNumber,
        altNumber: whatsappNumber,
        emailId,
        designation,
        userName,
        pincode,
      };

      set({
        isLoggedIn: true,
        userType: type === 'of' ? 'of' : 'ps',
        ...session,
        sessionData: session,
      });
      return true;
    }
    return false;
  },
}));