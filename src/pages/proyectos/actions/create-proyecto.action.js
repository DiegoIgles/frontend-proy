import cyborgApi from '../../../api/cyborg-api';

export const createProyectoAction = async (dto) => {
  const { data } = await cyborgApi.post('/proyectos', dto);
  return data;
};
