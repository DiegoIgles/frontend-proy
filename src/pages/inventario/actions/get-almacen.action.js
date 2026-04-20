import cyborgApi from '../../../api/cyborg-api';

export const getAlmacenAction = async (id) => {
  const { data } = await cyborgApi.get(`/inventario/almacenes/${id}`);
  return data;
};
