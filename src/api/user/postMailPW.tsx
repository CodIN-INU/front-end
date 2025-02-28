import axios, { AxiosResponse } from "axios";

const BASE_URL = "https://codin.inu.ac.kr/api";

export const PostMailPW = async (email: string): Promise<any> => {
  console.log("전송 데이터", email);

  try {
    const response: AxiosResponse<any> = await axios.post(
      `${BASE_URL}/email/auth/password`,
      { email: email }
    );

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};
