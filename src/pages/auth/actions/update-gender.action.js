import cyborgApi from '../../../api/cyborg-api';

export const updateGenderAction = async (profileId, gender) => {
  const { data } = await cyborgApi.patch(
    `/profile/upload-profile-image/${profileId}`,
    { gender },
  );
  return data;
};
