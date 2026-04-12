import cyborgApi from '../../../api/cyborg-api';

export const createCategoriaAction = async (dto) => {
  const { data } = await cyborgApi.post('/inventario/categorias', dto);
  return data;
};
