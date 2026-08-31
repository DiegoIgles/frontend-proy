import cyborgApi from '../../../api/cyborg-api';

export const addComponenteAction = async (productoId, dto) => {
  const { data } = await cyborgApi.post(`/inventario/productos/${productoId}/componentes`, dto);
  return data;
};
