import cyborgApi from '../../../api/cyborg-api';

export const deleteProfileImageAction = async (profileId) => {
  const { data } = await cyborgApi.delete(`/profile/delete-image/${profileId}`);
  return data;
};
