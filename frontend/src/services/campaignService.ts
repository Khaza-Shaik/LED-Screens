import API from './api';

export const uploadVideo = async (file: File, title: string) => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('title', title);
  
  const response = await API.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createSchedule = async (scheduleData: {
  videoId: string;
  screenId: string;
  date: string;
  startTime: string;
  endTime: string;
}) => {
  const response = await API.post('/schedule', scheduleData);
  return response.data;
};

export const getScreens = async () => {
  const response = await API.get('/screens');
  return response.data;
};
