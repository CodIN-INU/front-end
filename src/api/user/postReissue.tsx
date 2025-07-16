import axios, { AxiosResponse } from "axios";
import apiClient from "../clients/apiClient";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostReissue = async (): Promise<any> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await apiClient.post(
      `${apiUrl}/auth/reissue`
    );

    if( process.env.NEXT_PUBLIC_ENV === 'dev'){

      // ✅ 서버에서 받은 JWT 토큰을 헤더에서 추출
      const token = response.headers["authorization"].split(" ")[1];
      alert("토큰 재발급 성공: " + token);

      if (token) {
        // ✅ JWT를 localStorage에 저장 (WebView-safe)
        localStorage.setItem("accessToken", token);
      }
    }

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
