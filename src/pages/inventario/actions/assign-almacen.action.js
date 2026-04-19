import cyborgApi from '../../../api/cyborg-api';

export const assignAlmacenAction = async (productoId, dto) => {
  const { data } = await cyborgApi.post(`/inventario/productos/${productoId}/almacen`, dto);
  return data;
};
