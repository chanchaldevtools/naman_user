import apiClient, {BASE_URL} from './apiClient';

export interface VisitList {
  id?: number;
  description?: string;
  image?: string;
  is_complite?: number;
  perfomed_by?: string;
  police_station_id?: string;
  date_time?: string;
  presenter_id?: number;
  mobile_number?: string;
  photo?: string;
  house_no?: string;
  city?: string;
  pincode?: number;
  frist_name?: string;
  last_name?: string;
}

export interface VisitResponse {
  response?: string;
  data?: VisitList[];
}

export const visitApi = {
  fetchAllVisitList: async (
    psId: string,
  ): Promise<VisitResponse> => {
    const formData = new FormData();

    formData.append('police_station_id', psId);

    const res = await apiClient.post(
      'visited_create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return res.data;
  },

  addVisitor: async (
    userId: string,
    description: string,
    performedBy: string,
    policeStationId: string,
    imagePath: string,
  ): Promise<VisitResponse> => {
    const formData = new FormData();

    formData.append('user_id', userId);
    formData.append('description', description);
    formData.append('perfomed_by', performedBy);
    formData.append('police_station_id', policeStationId);

    if (imagePath) {
      const fileName =
        imagePath.split('/').pop() || 'photo.jpg';

      const fileType = fileName
        .toLowerCase()
        .endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';

      formData.append('image', {
        uri: imagePath,
        name: fileName,
        type: fileType,
      } as any);
    }

    const res = await apiClient.post(
      'visited_create',
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