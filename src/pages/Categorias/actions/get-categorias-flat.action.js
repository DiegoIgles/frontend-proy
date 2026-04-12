import cyborgApi from '../../../api/cyborg-api';

export const getCategoriasFlatAction = async () => {
  const { data } = await cyborgApi.get('/inventario/categorias/flat');
  return data;
};
