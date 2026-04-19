import cyborgApi from '../../../api/cyborg-api';

export const deleteAjusteAction = async (id) => {
  const { data } = await cyborgApi.delete(`/ajustes/${id}`);
  return data;
};
