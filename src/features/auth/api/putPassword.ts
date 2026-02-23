import axios, { AxiosResponse } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PutPassword = async (
  code: string | string[],
  password: string
): Promise<unknown> => {
  axios.defaults.withCredentials = true;
  const codeStr = Array.isArray(code) ? code[0] : code;
  const response: AxiosResponse = await axios.put(
    `${apiUrl}/users/password/${codeStr}`,
    { password }
  );
  return response.data;
};
