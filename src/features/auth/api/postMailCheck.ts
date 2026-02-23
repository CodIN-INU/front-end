import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostMailCheck = async (
  email: string,
  code: string
): Promise<void> => {
  await axios.post(`${apiUrl}/email/auth/check`, {
    email,
    authNum: code,
  });
};
