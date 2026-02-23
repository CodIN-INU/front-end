import axios, { AxiosResponse } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostPwCheck = async (
  email: string,
  code: string
): Promise<unknown> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse = await axios.post(
    `${apiUrl}/email/auth/password/check`,
    { email, authNum: code }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
