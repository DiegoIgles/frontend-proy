import cyborgApi from '../../../api/cyborg-api';

export const createProveedorAction = async (dto) => {
  const { data } = await cyborgApi.post('/compras/proveedores', dto);
  return data;
};
