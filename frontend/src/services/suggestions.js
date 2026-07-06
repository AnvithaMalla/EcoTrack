import api from './api';

export const fetchSuggestions = async (payload) => (await api.post('/api/suggestions', payload)).data;
