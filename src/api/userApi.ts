import apiClient from './apiClient';

export interface UserListData {
  id?: number;
  auth_token?: string;
  mobile_number?: string;
  frist_name?: string;
  last_name?: string;
  gender?: string;
  blood_group?: string;
  dob?: string;
  age?: number;
  maritual_status?: string;
  any_disablity?: string;
  desis_desc?: string;
  has_mediclaim?: string;
  house_no?: string;
  city?: string;
  pincode?: number;
  photo?: string;
  police_station_id?: string;
  country?: string;
  state?: string;
  status?: string;
  is_accept?: number;
  created_at?: string;
  is_handicaped?: string;
  has_co?: string;
  co_name?: string;
  co_contact_number?: string;
  has_son?: string;
  has_daughter?: string;
  has_son_law?: string;
  has_daughter_law?: string;
}

export interface UserListResponse {
  response?: string;
  userData?: UserListData[];
}

export interface ResponseModel {
  response?: string;
  message?: string;
}

export const userApi = {
  fetchUserList: async (
    psName: string,
  ): Promise<UserListResponse> => {
    const formData = new FormData();

    formData.append('policestation_name', psName);

    const res = await apiClient.post(
      'police_station_user_list',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

   

    return res.data;
  },

  searchUsers: async (
    key: string,
  ): Promise<UserListResponse> => {
    const formData = new FormData();

    formData.append('key', key);

    const res = await apiClient.post(
      'user_find',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  },

  acceptReject: async (
    userId: string,
    action: string,
  ): Promise<ResponseModel> => {
    const formData = new FormData();

    formData.append('user_id', userId);
    formData.append('action', action);

    const res = await apiClient.post(
      'user_action',
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