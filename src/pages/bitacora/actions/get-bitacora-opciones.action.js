import cyborgApi from '../../../api/cyborg-api';

export const getBitacoraOpcionesAction = async () => {
  const { data } = await cyborgApi.get('/bitacora/opciones');
  return data;
};
