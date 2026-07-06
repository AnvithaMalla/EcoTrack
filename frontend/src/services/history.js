import api from './api';

export const fetchHistory = async (params = {}) => (await api.get('/api/history', { params })).data;
export const exportHistoryCsv = async (params = {}) => (await api.get('/api/history', { params: { ...params, format: 'csv' }, responseType: 'blob' })).data;
