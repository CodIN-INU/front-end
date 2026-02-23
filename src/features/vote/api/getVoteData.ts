import axios, { AxiosResponse } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const GetVoteData = async (page: number): Promise<unknown> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse = await axios.get(
      `${apiUrl}/posts/category?postCategory=POLL&page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
