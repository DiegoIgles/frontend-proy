import cyborgApi from '../../../api/cyborg-api';

export const marcarTodasLeidasAction = async () => {
  const { data } = await cyborgApi.patch('/notificaciones/leer-todas');
  return data;
};
