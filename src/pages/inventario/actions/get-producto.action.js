import cyborgApi from '../../../api/cyborg-api';

export const getProductoAction = async (id) => {
  const { data } = await cyborgApi.get(`/inventario/productos/${id}`);
  return data;
};
