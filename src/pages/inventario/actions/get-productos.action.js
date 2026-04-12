import cyborgApi from '../../../api/cyborg-api';

export const getProductosAction = async () => {
  const { data } = await cyborgApi.get('/inventario/productos');
  return data.data;
};
