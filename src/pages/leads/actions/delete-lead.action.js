import cyborgApi from '../../../api/cyborg-api';

export const deleteLeadAction = async (id) => {
  const { data } = await cyborgApi.delete(`/ventas/dato-lead/${id}`);
  return data;
};
