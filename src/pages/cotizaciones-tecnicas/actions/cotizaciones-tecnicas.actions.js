import cyborgApi from '../../../api/cyborg-api';

const BASE = '/cotizaciones-tecnicas';

export const getPlantillaTecnicaAction = async () => (await cyborgApi.get(`${BASE}/plantilla`)).data;
export const getCotizacionesTecnicasAction = async (params = {}) => (await cyborgApi.get(BASE, { params })).data;
export const getCotizacionTecnicaAction = async (id) => (await cyborgApi.get(`${BASE}/${id}`)).data;
export const createCotizacionTecnicaAction = async (dto) => (await cyborgApi.post(BASE, dto)).data;
export const updateCotizacionTecnicaAction = async (id, dto) => (await cyborgApi.patch(`${BASE}/${id}`, dto)).data;
export const deleteCotizacionTecnicaAction = async (id) => (await cyborgApi.delete(`${BASE}/${id}`)).data;

// Hoja técnica de una cotización comercial (la crea si la comercial es anterior al módulo).
export const getTecnicaParaManualAction = async (manualId) => (await cyborgApi.post(`${BASE}/para-manual/${manualId}`)).data;

// Trae como secciones nuevas las categorías raíz creadas después de la hoja.
export const sincronizarSeccionesAction = async (id) => (await cyborgApi.post(`${BASE}/${id}/sincronizar-secciones`)).data;

// Agrega a la hoja los productos de la comercial que aun no esten (clasificados por categoria).
export const traerProductosComercialAction = async (id) => (await cyborgApi.post(`${BASE}/${id}/traer-productos-comercial`)).data;

export const getVersionesTecnicaAction = async (id) => (await cyborgApi.get(`${BASE}/${id}/versiones`)).data;
export const getVersionTecnicaAction = async (id, n) => (await cyborgApi.get(`${BASE}/${id}/versiones/${n}`)).data;
export const restaurarVersionTecnicaAction = async (id, n) => (await cyborgApi.post(`${BASE}/${id}/versiones/${n}/restaurar`)).data;

export const generarComercialAction = async (id, modo) => (await cyborgApi.post(`${BASE}/${id}/generar-comercial`, { modo })).data;

// Descarga el .xlsx: la API responde binario, así que se pide como blob y se
// dispara la descarga desde el navegador.
export const descargarExcelTecnicaAction = async (id, nombreArchivo = 'costos.xlsx') => {
  const { data, headers } = await cyborgApi.get(`${BASE}/${id}/excel`, { responseType: 'blob' });
  const match = /filename="?([^"]+)"?/.exec(headers['content-disposition'] || '');
  const url = window.URL.createObjectURL(new Blob([data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = match?.[1] || nombreArchivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
