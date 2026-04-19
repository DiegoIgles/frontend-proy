import cyborgApi from '../../../api/cyborg-api';

export const deleteSeguimientoAction = async (proyectoId, seguimientoId) => {
  const { data } = await cyborgApi.delete(`/proyectos/${proyectoId}/seguimiento/${seguimientoId}`);
  return data;
};
