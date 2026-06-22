import cyborgApi from '../../../api/cyborg-api';

export const marcarNotificacionLeidaAction = async (usuarioNotificacionId) => {
  const { data } = await cyborgApi.patch(`/notificaciones/${usuarioNotificacionId}/leida`);
  return data;
};
