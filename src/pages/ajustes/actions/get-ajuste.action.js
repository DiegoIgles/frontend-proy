import cyborgApi from '../../../api/cyborg-api';

export const getAjusteAction = async (id) => {
  const { data } = await cyborgApi.get(`/ajustes/${id}`);
  return data;
};
