import apiClient from './apiClient';

export interface LoginUserData {
  id?: number;
  auth_token?: string;
  police_station_name?: string;
  incharge_name?: string;
  area?: string;
  pincode?: string;
  station_type?: string;
  mobile_number?: string;
  whatsapp_number?: string;
  city?: string;
  email_id?: string;
  state?: string;
  country?: string;
  is_approved?: number;
  status?: number;
}

export interface OfficerLoginUserData {
  id?: number;
  officer_name?: string;
  mobile_number?: string;
  designation?: string;
  fcm_token?: string;
  is_active?: number;
  police_station_name?: string;
  user_name?: string;
  created_at?: string;
}

export interface LoginResponse {
  response?: string;
  userData?: LoginUserData;
}

export interface OfficerLoginResponse {
  response?: string;
  userData?: OfficerLoginUserData;
}

const createLoginFormData = (
  mobileNumber: string,
  password: string,
  loginType: string,
  deviceToken: string,
) => {
  const formData = new FormData();

  formData.append('mobile_number', mobileNumber);
  formData.append('password', password);
  formData.append('login_type', loginType);
  formData.append('device_token', deviceToken);

  return formData;
};

export const loginApi = {
  psLogin: async (
    mobileNumber: string,
    password: string,
    loginType: string,
    deviceToken: string,
  ): Promise<LoginResponse> => {
    const formData = createLoginFormData(
      mobileNumber,
      password,
      loginType,
      deviceToken,
    );

    const res = await apiClient.post(
      'police_station_login',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  },

  officerLogin: async (
    mobileNumber: string,
    password: string,
    loginType: string,
    deviceToken: string,
  ): Promise<OfficerLoginResponse> => {
    const formData = createLoginFormData(
      mobileNumber,
      password,
      loginType,
      deviceToken,
    );

    const res = await apiClient.post(
      'police_station_login',
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