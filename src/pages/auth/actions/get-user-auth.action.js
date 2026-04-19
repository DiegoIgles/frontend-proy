import cyborgApi from '../../../api/cyborg-api';

export const getUserAuthAction = async () => {
  const { data } = await cyborgApi.get('/auth/user');
  return data;
};
