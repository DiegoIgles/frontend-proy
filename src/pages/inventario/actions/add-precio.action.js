import cyborgApi from '../../../api/cyborg-api';

export const addPrecioAction = async (productoId, dto) => {
  const { data } = await cyborgApi.post(`/inventario/productos/${productoId}/precios`, dto);
  return data;
};
