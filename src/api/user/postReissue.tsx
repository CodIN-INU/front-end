import axios, { AxiosResponse } from "axios";
import apiClient from "../clients/apiClient";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostReissue = async (): Promise<any> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await apiClient.post(
      `${apiUrl}/auth/reissue`
    );

    console.log(response.data);
    console.log(response.headers);

    return response;
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
