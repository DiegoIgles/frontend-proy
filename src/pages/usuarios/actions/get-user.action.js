import cyborgApi from '../../../api/cyborg-api';

export const getUserAction = async (id) => {
  const { data } = await cyborgApi.get(`/auth/users/${id}`);
  return data;
};
