import cyborgApi from '../../../api/cyborg-api';

export const getProductosAction = async (filters = {}) => {
  const params = {};
  if (filters.limit)    params.limit    = filters.limit;
  if (filters.offset !== undefined) params.offset = filters.offset;
  if (filters.search)   params.search   = filters.search;
  if (filters.categoriaId)   params.categoriaId   = filters.categoriaId;
  if (filters.marcaModeloId) params.marcaModeloId = filters.marcaModeloId;
  if (filters.almacenId)     params.almacenId     = filters.almacenId;
  if (filters.conStock !== undefined && filters.conStock !== '')
    params.conStock = filters.conStock;
  const { data } = await cyborgApi.get('/inventario/productos', { params });
  return data;
};
