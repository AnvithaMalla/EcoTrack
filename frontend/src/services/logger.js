import api from './api';

export const submitLog = async (payload) => (await api.post('/api/log', payload)).data;
