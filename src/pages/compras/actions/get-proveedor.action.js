import cyborgApi from '../../../api/cyborg-api';

export const getProveedorAction = async (id) => {
  const { data } = await cyborgApi.get(`/compras/proveedores/${id}`);
  return data;
};
