import axios, { AxiosResponse } from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostSignup = async (
  email: string | string[] | null,
  nickname: string,
  profileImage: File | null
): Promise<unknown> => {
  axios.defaults.withCredentials = true;

  const formData = new FormData();
  formData.append(
    'userProfileRequestDto ',
    JSON.stringify({ email: email ?? '', nickname })
  );
  if (profileImage) formData.append('userImage', profileImage);

  try {
    const response: AxiosResponse = await axios.post(
      `${apiUrl}/auth/signup`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
