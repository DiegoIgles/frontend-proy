import cyborgApi from '../../../api/cyborg-api';

export const changePasswordAction = async (id, newPassword) => {
  const { data } = await cyborgApi.patch(`/auth/users/${id}/password`, { newPassword });
  return data;
};
