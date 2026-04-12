import cyborgApi from '../../../api/cyborg-api';

export const getCategoriasAction = async () => {
  const { data } = await cyborgApi.get('/inventario/categorias');
  return data;
};
