import cyborgApi from '../../../api/cyborg-api';

export const getProyectoAction = async (id) => {
  const { data } = await cyborgApi.get(`/proyectos/${id}`);
  return data;
};
