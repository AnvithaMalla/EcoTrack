import api from './api';

export const downloadReport = async (payload) => (await api.post('/api/report', payload, { responseType: 'blob' })).data;
