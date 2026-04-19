import cyborgApi from '../../../api/cyborg-api';

export const getUsersAction = async (filters = {}) => {
  const params = {};
  if (filters.limit)    params.limit  = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;
  if (filters.search)   params.search   = filters.search;
  if (filters.role)     params.role     = filters.role;
  if (filters.isActive !== undefined && filters.isActive !== '') params.isActive = filters.isActive;
  const { data } = await cyborgApi.get('/auth/users', { params });
  return data;
};
