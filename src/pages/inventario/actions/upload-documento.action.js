import cyborgApi from '../../../api/cyborg-api';

// Sube un archivo de cualquier tipo (pdf, imagen, doc...) para adjuntarlo a un producto.
export const uploadDocumentoAction = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await cyborgApi.post('/cloud/upload-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { secureUrl, publicId, formato, bytes }
};
