import cyborgApi from '../../../api/cyborg-api';

export const getAlmacenesAction = async () => {
  const { data } = await cyborgApi.get('/inventario/almacenes');
  return Array.isArray(data) ? data : (data.data ?? []);
};
