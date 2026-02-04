import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

export const scanImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(`${API_URL}/scan`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(`${API_URL}/history`);
  return response.data;
};