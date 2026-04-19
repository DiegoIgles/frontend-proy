import cyborgApi from '../../../api/cyborg-api';

export const createAjusteAction = async (dto) => {
  const { data } = await cyborgApi.post('/ajustes', dto);
  return data;
};
