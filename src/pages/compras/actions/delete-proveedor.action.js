import cyborgApi from '../../../api/cyborg-api';

export const deleteProveedorAction = async (id) => {
  const { data } = await cyborgApi.delete(`/compras/proveedores/${id}`);
  return data;
};
