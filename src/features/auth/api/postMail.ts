import axios, { AxiosResponse } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostMail = async (email: string): Promise<unknown> => {
  const response: AxiosResponse = await axios.post(
    `${apiUrl}/email/auth/send`,
    { email }
  );
  return response.data;
};
