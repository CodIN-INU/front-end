import axios, { AxiosResponse } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostPortal = async (
  studentId: string,
  password: string
): Promise<AxiosResponse> => {
  axios.defaults.withCredentials = true;
  return axios.post(
    `${apiUrl}/auth/portal`,
    { studentId, password },
    { withCredentials: true }
  );
};
