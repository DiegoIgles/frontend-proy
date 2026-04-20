import cyborgApi from '../../../api/cyborg-api';

export const deleteAlmacenAction = async (id) => {
  const { data } = await cyborgApi.delete(`/inventario/almacenes/${id}`);
  return data;
};
