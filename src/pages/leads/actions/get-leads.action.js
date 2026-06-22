import cyborgApi from '../../../api/cyborg-api';

// El backend (DatoLeadService.findAll) solo soporta filtro por "search" (nombre ILIKE)
// y devuelve el arreglo completo sin paginar. Paginación y rango de fechas se aplican
// en el cliente (ver Leads.jsx).
export const getLeadsAction = async (filters = {}) => {
  const params = {};
  if (filters.search) params.search = filters.search;
  const { data } = await cyborgApi.get('/ventas/dato-lead', { params });
  return data;
};
