import cyborgApi from '../../../api/cyborg-api';

export const addSeguimientoAction = async (id, dto) => {
  const { data } = await cyborgApi.post(`/proyectos/${id}/seguimiento`, dto);
  return data;
};
