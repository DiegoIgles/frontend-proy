import cyborgApi from '../../../api/cyborg-api';

export const uploadImagenCotizacionAction = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await cyborgApi.post('/cloud/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { secureUrl, publicId }
};
