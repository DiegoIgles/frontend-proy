import cyborgApi from '../../../api/cyborg-api';

export const getClienteAction = async (id) => {
  const { data } = await cyborgApi.get(`/ventas/clientes/${id}`);
  return data;
};
