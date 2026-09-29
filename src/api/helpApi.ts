import apiClient from './apiClient';

export interface PoliceHelpList {
  id?: number;
  help_type?: string;
  is_accept?: number;
  date?: string;
  frist_name?: string;
  last_name?: string;
  mobile_number?: string;
  photo?: string;
  house_no?: string;
  city?: string;
  pincode?: number;
  perfomed_by?: string;
  compliteed_by_id?: number;
}

export interface HelpListResponse {
  response?: string;
  data?: PoliceHelpList[];
}

export interface ResponseModel {
  response?: string;
}

export const helpApi = {
  fetchHelpList: async (
    psId: string,
  ): Promise<HelpListResponse> => {
    const formData = new FormData();

    formData.append('police_id', psId);

    const res = await apiClient.post(
      'view_help_list_police',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  },

  helpAcceptReject: async (
    type: string,
    id: string,
    note: string,
    officerId: string,
    performedBy: string,
  ): Promise<ResponseModel> => {
    const formData = new FormData();

    formData.append('type', type);
    formData.append('idoflist', id);
    formData.append('note', note);
    formData.append('officer_id', officerId);
    formData.append('perfomed_by', performedBy);

    const res = await apiClient.post(
      'help_accept_reject',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  },
};