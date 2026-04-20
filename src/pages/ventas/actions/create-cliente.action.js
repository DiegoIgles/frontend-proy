import cyborgApi from '../../../api/cyborg-api';

export const createClienteAction = async (dto) => {
  const { data } = await cyborgApi.post('/ventas/clientes', dto);
  return data;
};
