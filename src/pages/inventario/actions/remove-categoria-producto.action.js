import cyborgApi from '../../../api/cyborg-api';

export const removeCategoriaProductoAction = async (productoId, categoriaId) => {
  const { data } = await cyborgApi.delete(`/inventario/productos/${productoId}/categorias/${categoriaId}`);
  return data;
};
