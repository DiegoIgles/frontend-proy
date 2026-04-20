import cyborgApi from '../../../api/cyborg-api';

export const getProveedoresAction = async (filters = {}) => {
  const params = {};
  if (filters.limit)              params.limit  = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;
  if (filters.search)             params.search = filters.search;
  const { data } = await cyborgApi.get('/compras/proveedores', { params });
  return data;
};
