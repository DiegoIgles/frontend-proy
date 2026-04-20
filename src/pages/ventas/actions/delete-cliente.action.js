import cyborgApi from '../../../api/cyborg-api';

export const deleteClienteAction = async (id) => {
  const { data } = await cyborgApi.delete(`/ventas/clientes/${id}`);
  return data;
};
