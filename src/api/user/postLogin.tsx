import axios, { AxiosResponse } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostLogin = async (
    studentId: string,
    password: string
): Promise<any> => {
  console.log("전송 데이터", studentId, password);
  axios.defaults.withCredentials = true;

  try {
    const response: AxiosResponse<any> = await axios.post(
        `${apiUrl}/auth/login`,
        {
          email: studentId,
          password: password,
        },
        { withCredentials: true }
    );

    const token =
      response.headers['authorization']?.split(' ')[1] ??
      response.data?.accessToken ??
      response.data?.token;

    if (token) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('x-access-token');
      localStorage.setItem('accessToken', token);
      localStorage.setItem('x-access-token', token);
      document.cookie = `x-access-token=${token}; path=/; max-age=3600; SameSite=Lax`;
    }

    console.log(response.data);
    console.log(response.headers);

    // 로그인 성공 시 React Native로 메시지 전송
    onLoginSuccess(); // 로그인 성공 시 네이티브로 메시지 전달

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

// 로그인 성공 시 네이티브로 메시지 보내는 함수
const onLoginSuccess = () => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "LOGIN_SUCCESS" })
    );
  }
};
