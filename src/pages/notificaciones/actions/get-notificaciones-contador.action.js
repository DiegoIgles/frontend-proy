import cyborgApi from '../../../api/cyborg-api';

export const getNotificacionesContadorAction = async () => {
  const { data } = await cyborgApi.get('/notificaciones/no-leidas/contador');
  return data;
};
