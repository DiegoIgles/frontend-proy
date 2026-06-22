import cyborgApi from '../../../api/cyborg-api';

export const updateLeadAction = async (id, dto) => {
  const { data } = await cyborgApi.patch(`/ventas/dato-lead/${id}`, dto);
  return data;
};
