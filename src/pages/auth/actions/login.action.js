import cyborgApi from '../../../api/cyborg-api';

/**
 * @param {import('../interfaces/auth.interface').LoginCredentials} credentials
 * @returns {Promise<import('../interfaces/auth.response.interface').LoginResponse>}
 */
export const loginAction = async (credentials) => {
  const { data } = await cyborgApi.post('/auth/login', credentials);
  return data;
};
