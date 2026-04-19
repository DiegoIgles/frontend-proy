import cyborgApi from '../../../api/cyborg-api';

export const updateProductoAction = async (id, dto) => {
  const { data } = await cyborgApi.patch(`/inventario/productos/${id}`, dto);
  return data;
};
