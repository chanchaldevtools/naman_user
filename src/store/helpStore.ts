import {create} from 'zustand';
import {helpApi, PoliceHelpList} from '../api/helpApi';
import {storage, KEYS} from '../utils/storage';

interface HelpState {
  isLoading: boolean;
  helpList: PoliceHelpList[];
  newHelpList: PoliceHelpList[];
  solvedHelpList: PoliceHelpList[];
  rejectedHelpList: PoliceHelpList[];
  error: string | null;
  reasonText: string;

  getHelpList: (psName?: string) => Promise<void>;
  helpAcceptRejected: (
    type: string,
    id: string,
    note?: string,
    officerId?: string,
    officerName?: string,
    psName?: string,
  ) => Promise<string>;
  setReasonText: (text: string) => void;
}

export const useHelpStore = create<HelpState>((set, get) => ({
  isLoading: false,
  helpList: [],
  newHelpList: [],
  solvedHelpList: [],
  rejectedHelpList: [],
  error: null,
  reasonText: '',

  getHelpList: async (psName?: string) => {
    set({isLoading: true, error: null});
    try {
      let station = psName;
      if (!station) {
        station = (await storage.get(KEYS.psName)) ?? '';
      }
      const res = await helpApi.fetchHelpList(station);
      if (res.data) {
        const all = res.data;
        // 0 = pending, 1 = accepted (in progress), 2 = rejected, 3 = solved
        const newHelp = all.filter(
          h =>
            String(h.is_accept) === '0' ||
            String(h.is_accept) === '1',
        );
        const solved = all.filter(h => String(h.is_accept) === '3');
        const rejected = all.filter(h => String(h.is_accept) === '2');
        set({
          helpList: all,
          newHelpList: newHelp,
          solvedHelpList: solved,
          rejectedHelpList: rejected,
          isLoading: false,
        });
      } else {
        set({isLoading: false});
      }
    } catch (e) {
      set({isLoading: false, error: 'Failed to fetch help requests'});
    }
  },

  helpAcceptRejected: async (type, id, note = '', officerId, officerName, psName) => {
    try {
      const oId = officerId ?? (await storage.get(KEYS.userId)) ?? '';
      const oName = officerName ?? (await storage.get(KEYS.officerName)) ?? '';
      const pName = psName ?? (await storage.get(KEYS.psName)) ?? '';

      const res = await helpApi.helpAcceptReject(type, id, note, oId, oName);
      if (res.response === 'ok') {
        await get().getHelpList(pName);
        set({reasonText: ''});
        return 'ok';
      }
      return res.response ?? 'error';
    } catch (e) {
      return 'error';
    }
  },

  setReasonText: (text: string) => set({reasonText: text}),
}));
