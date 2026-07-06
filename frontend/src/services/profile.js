import api from './api';

export const fetchProfile = async () => (await api.get('/api/profile')).data;
export const updateProfile = async (payload) => (await api.put('/api/profile', payload)).data;
