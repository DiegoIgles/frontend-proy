import cyborgApi from '../../../api/cyborg-api';

export const checkAuthStatusAction = async () => {
  const { data } = await cyborgApi.get('/auth/check-status');
  return data;
};
