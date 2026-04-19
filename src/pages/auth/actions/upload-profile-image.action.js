import cyborgApi from '../../../api/cyborg-api';

export const uploadProfileImageAction = async (profileId, file, gender) => {
  const formData = new FormData();
  formData.append('file', file);
  if (gender !== undefined) formData.append('gender', gender);

  const { data } = await cyborgApi.patch(
    `/profile/upload-profile-image/${profileId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};
