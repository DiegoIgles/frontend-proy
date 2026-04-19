import cyborgApi from '../../../api/cyborg-api';

export const createUserAction = async (dto) => {
  const { data } = await cyborgApi.post('/auth/users', dto);
  return data;
};
