import cyborgApi from '../../../api/cyborg-api';

export const updateClienteAction = async (id, dto) => {
  const { data } = await cyborgApi.patch(`/ventas/clientes/${id}`, dto);
  return data;
};
