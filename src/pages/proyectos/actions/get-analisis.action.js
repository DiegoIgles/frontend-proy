import cyborgApi from '../../../api/cyborg-api';

export const getAnalisisAction = async (id) => {
  const { data } = await cyborgApi.get(`/proyectos/${id}/analisis`);
  return data;
};
