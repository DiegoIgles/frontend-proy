import cyborgApi from '../../../api/cyborg-api';

export const getComponentesAction = async (productoId) => {
  const { data } = await cyborgApi.get(`/inventario/productos/${productoId}/componentes`);
  return data;
};
