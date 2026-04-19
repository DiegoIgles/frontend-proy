import cyborgApi from '../../../api/cyborg-api';

export const updateUserAction = async (id, dto) => {
  const { data } = await cyborgApi.patch(`/auth/users/${id}`, dto);
  return data;
};
