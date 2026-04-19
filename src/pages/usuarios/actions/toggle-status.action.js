import cyborgApi from '../../../api/cyborg-api';

export const toggleStatusAction = async (id) => {
  const { data } = await cyborgApi.patch(`/auth/users/${id}/toggle-status`);
  return data;
};
