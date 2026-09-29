import apiClient from './apiClient';

export interface UserRegisterResponse {
  response?: string;
  userData?: any;
}

export const registerUserApi = {
  registerUser: async (formData: FormData): Promise<UserRegisterResponse> => {
    const res = await apiClient.post('register', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return res.data;
  },
};
