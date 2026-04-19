import cyborgApi from '../../../api/cyborg-api';

export const getAjustesAction = async () => {
  const { data } = await cyborgApi.get('/ajustes');
  return data;
};
