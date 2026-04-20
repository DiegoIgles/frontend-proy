import cyborgApi from '../../../api/cyborg-api';

export const updateAlmacenAction = async (id, dto) => {
  const { data } = await cyborgApi.patch(`/inventario/almacenes/${id}`, dto);
  return data;
};
