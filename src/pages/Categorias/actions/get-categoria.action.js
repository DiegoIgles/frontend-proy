import cyborgApi from '../../../api/cyborg-api';

export const getCategoriaAction = async (id) => {
  const { data } = await cyborgApi.get(`/inventario/categorias/${id}`);
  return data;
};
