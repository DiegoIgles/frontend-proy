import cyborgApi from '../../../api/cyborg-api';

export const getProductoStockAction = async (productoId) => {
  const { data } = await cyborgApi.get(`/inventario/productos/${productoId}/stock`);
  return data.porAlmacen ?? [];
};
