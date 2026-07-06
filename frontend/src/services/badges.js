import api from './api';

export const fetchBadges = async () => (await api.get('/api/badges')).data;
