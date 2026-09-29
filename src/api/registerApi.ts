import apiClient from './apiClient';

export interface OfficerList {
  id?: number;
  officer_name?: string;
  mobile_number?: string;
  designation?: string;
  fcm_token?: string;
  is_active?: number;
  police_station_name?: string;
  created_at?: string;
  user_name?: string;
}

export interface OfficerDataModel {
  response?: string;
  officer_list?: OfficerList[];
}

export interface ResponseModel {
  response?: string;
}

export interface CityItem {
  id?: number;
  city_name?: string;
  city?: string;
}

export interface CityListResponse {
  response?: string;
  city_list?: CityItem[];
}

export const registerApi = {
  registerStation: async (
    mobileNumber: string,
    password: string,
    inchargeName: string,
    stationType: string,
    alternativeNumber: string,
    city: string,
    state: string,
    country: string,
    pincode: string,
    area: string,
    policeStationName: string,
    email: string,
  ): Promise<ResponseModel> => {
    const formData = new FormData();

    formData.append('mobile_number', mobileNumber);
    formData.append('password', password);
    formData.append('incharge_name', inchargeName);
    formData.append('station_type', stationType);
    formData.append('alternet_number', alternativeNumber);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('country', country);
    formData.append('pincode', pincode);
    formData.append('area', area);
    formData.append('police_station_name', policeStationName);
    formData.append('email_id', email);

    const res = await apiClient.post(
      'police_station_register',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  },

  registerOfficer: async (
    officerName: string,
    mobileNumber: string,
    designation: string,
    password: string,
    policeStationName: string,
  ): Promise<OfficerDataModel> => {
    const formData = new FormData();

    formData.append('officer_name', officerName);
    formData.append('mobile_number', mobileNumber);
    formData.append('designation', designation);
    formData.append('password', password);
    formData.append('police_station_name', policeStationName);
    console.log(formData);
    const res = await apiClient.post(
      'officer_create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  },

  fetchOfficerList: async (
    psName: string,
  ): Promise<OfficerDataModel> => {
    const formData = new FormData();

    formData.append('police_station_name', psName);
    formData.append('action', 'view');

    const res = await apiClient.post(
      'officer_create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  },

  fetchCityList: async (): Promise<CityListResponse> => {
    const res = await apiClient.post('city_list');

    return res.data;
  },

  setFcm: async (
    userId: string,
    fcm: string,
  ): Promise<ResponseModel> => {
    const formData = new FormData();

    formData.append('user_id', userId);
    formData.append('fcm', fcm);

    const res = await apiClient.post(
      'set_fcm',
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