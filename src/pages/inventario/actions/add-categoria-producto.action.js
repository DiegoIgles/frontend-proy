import cyborgApi from '../../../api/cyborg-api';

export const addCategoriaProductoAction = async (productoId, dto) => {
  const { data } = await cyborgApi.post(`/inventario/productos/${productoId}/categorias`, dto);
  return data;
};
