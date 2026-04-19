import cyborgApi from '../../../api/cyborg-api';

export const deleteProductoAction = async (id) => {
  const { data } = await cyborgApi.delete(`/inventario/productos/${id}`);
  return data;
};
