import cyborgApi from '../../../api/cyborg-api';

export const updateCategoriaAction = async (id, dto) => {
  const { data } = await cyborgApi.patch(`/inventario/categorias/${id}`, dto);
  return data;
};
