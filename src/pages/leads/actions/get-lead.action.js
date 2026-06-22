import cyborgApi from '../../../api/cyborg-api';

export const getLeadAction = async (id) => {
  const { data } = await cyborgApi.get(`/ventas/dato-lead/${id}`);
  return data;
};
