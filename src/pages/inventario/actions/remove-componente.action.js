import cyborgApi from '../../../api/cyborg-api';

export const removeComponenteAction = async (productoId, componenteId) => {
  const { data } = await cyborgApi.delete(`/inventario/productos/${productoId}/componentes/${componenteId}`);
  return data;
};
