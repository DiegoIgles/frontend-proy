import cyborgApi from '../../../api/cyborg-api';

export const deleteProyectoAction = async (id) => {
  const { data } = await cyborgApi.delete(`/proyectos/${id}`);
  return data;
};
