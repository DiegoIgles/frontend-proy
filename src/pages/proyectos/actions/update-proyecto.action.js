import cyborgApi from '../../../api/cyborg-api';

export const updateProyectoAction = async (id, dto) => {
  const { data } = await cyborgApi.patch(`/proyectos/${id}`, dto);
  return data;
};
