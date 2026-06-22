import cyborgApi from '../../../api/cyborg-api';

export const enviarNotificacionManualAction = async (dto) => {
  const { data } = await cyborgApi.post('/notificaciones/manual', dto);
  return data;
};
