import cyborgApi from '../../../api/cyborg-api';

export const getProveedoresAction = async () => {
  const { data } = await cyborgApi.get('/compras/proveedores');
  return data.data;
};
