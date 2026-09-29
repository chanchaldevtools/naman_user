import {create} from 'zustand';
import {visitApi, VisitList} from '../api/visitApi';
import {storage, KEYS} from '../utils/storage';

interface VisitState {
  isLoading: boolean;
  visitList: VisitList[];
  selectedImagePath: string;
  visitComment: string;
  error: string | null;

  getAllVisitList: (psName?: string) => Promise<void>;
  addVisitorReport: (
    userId: string,
    description: string,
    performedBy?: string,
    policeStationId?: string,
    imagePath?: string,
  ) => Promise<string>;
  setSelectedImagePath: (path: string) => void;
  setVisitComment: (text: string) => void;
  clearForm: () => void;
}

export const useVisitStore = create<VisitState>((set, get) => ({
  isLoading: false,
  visitList: [],
  selectedImagePath: '',
  visitComment: '',
  error: null,

  getAllVisitList: async (psName?: string) => {
    set({isLoading: true, error: null});
    try {
      let station = psName;
      if (!station) {
        station = (await storage.get(KEYS.psName)) ?? '';
      }
      const res = await visitApi.fetchAllVisitList(station);
      if (res.data) {
        set({visitList: res.data, isLoading: false});
      } else {
        set({isLoading: false});
      }
    } catch (e) {
      set({isLoading: false, error: 'Failed to fetch visits'});
    }
  },

  addVisitorReport: async (userId, description, performedBy, policeStationId, imagePath) => {
    try {
      const perfBy =
        performedBy ??
        (await storage.get(KEYS.officerName)) ??
        (await storage.get(KEYS.inchargeName)) ??
        '';
      const psId = policeStationId ?? (await storage.get(KEYS.psName)) ?? '';
      const img = imagePath ?? get().selectedImagePath;

      const res = await visitApi.addVisitor(
        userId,
        description,
        perfBy,
        psId,
        img,
      );
      if (res.response === 'ok') {
        if (res.data) {
          set({visitList: res.data});
        }
        set({selectedImagePath: '', visitComment: ''});
        return 'ok';
      }
      return res.response ?? 'error';
    } catch (e) {
      return 'error';
    }
  },

  setSelectedImagePath: (path: string) => set({selectedImagePath: path}),
  setVisitComment: (text: string) => set({visitComment: text}),
  clearForm: () => set({selectedImagePath: '', visitComment: ''}),
}));
