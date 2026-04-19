import cyborgApi from '../../../api/cyborg-api';

export const aprobarProyectoAction = async (id) => {
  const { data } = await cyborgApi.patch(`/proyectos/${id}/aprobar`);
  return data;
};
