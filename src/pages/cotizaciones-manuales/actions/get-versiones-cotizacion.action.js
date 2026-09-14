import cyborgApi from '../../../api/cyborg-api';

export const getVersionesCotizacionAction = async (id) => {
  const { data } = await cyborgApi.get(`/cotizaciones-manuales/${id}/versiones`);
  return data; // { versionActual, versiones: [{ numero, origen, restauradaDesde, creadoEn, esActual, usuario }] }
};

export const getVersionCotizacionAction = async (id, numero) => {
  const { data } = await cyborgApi.get(`/cotizaciones-manuales/${id}/versiones/${numero}`);
  return data; // misma forma que GET /:id + { version: {...} }
};

export const restaurarVersionCotizacionAction = async (id, numero) => {
  const { data } = await cyborgApi.post(`/cotizaciones-manuales/${id}/versiones/${numero}/restaurar`);
  return data;
};
